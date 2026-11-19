import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { hashRecoveryCode, createRecoveryCode } from "./recoveryCodes.js";
import { rotateRecoveryCode } from "./redeemRecovery.js";

// In-memory Redis mock with Lua simulation for redeemRecovery
function makeRedis(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    async get(key) { return data.get(key) ?? null; },
    async eval(script, keys, args) {
      // Simulates the rotateRecoveryCode Lua script.
      // KEYS: [oldCodeKey, newCodeKey, ownerKey, indexKey, sessionKey]
      // ARGV: [customerId, newSessionId, oldHash, newHash, newRecord]
      const [oldCodeKey, newCodeKey, ownerKey, indexKey, sessionKey] = keys;
      const [customerId, newSessionId, oldHash, newHash, newRecord] = args;

      const stored = data.get(oldCodeKey);
      if (!stored) return 0;

      let existing;
      try {
        existing = typeof stored === "string" ? JSON.parse(stored) : stored;
      } catch {
        return 0;
      }
      if (!existing || typeof existing !== "object") return 0;
      if (existing.customerId !== customerId) return 0;

      const owner = data.get(ownerKey);
      if (owner === null || owner === undefined) return 0;

      const indexHash = data.get(indexKey);
      if (indexHash !== oldHash) return 0;

      if (data.has(newCodeKey)) return 0;

      const newRecordParsed = typeof newRecord === "string" ? JSON.parse(newRecord) : newRecord;
      data.set(newCodeKey, newRecordParsed);
      data.delete(oldCodeKey);
      data.set(ownerKey, newSessionId);
      data.set(indexKey, newHash);
      data.set(sessionKey, customerId);

      return 1;
    },
  };
}

function makeCodeRecord(customerId, products = ["lumaga_wild"]) {
  return { customerId, products };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test("Erfolgreiche Einlösung: alter Code entfernt, neuer Code gesetzt, Eigner aktualisiert", async () => {
  const customerId = randomUUID();
  const originalSession = randomUUID();
  const newSession = randomUUID();
  const code = createRecoveryCode();
  const hash = hashRecoveryCode(code);

  const redis = makeRedis({
    ["lumaga:recovery:code:v1:" + hash]: makeCodeRecord(customerId),
    ["lumaga:recovery:owner:v1:" + customerId]: originalSession,
    ["lumaga:recovery:index:v1:" + customerId]: hash,
  });

  const result = await rotateRecoveryCode(code, newSession, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.ok(result, "Einlösung muss erfolgreich sein");
  assert.match(result.newCode, /^LMG-[A-Za-z0-9_-]{32}$/, "Neuer Code muss gültiges Format haben");
  assert.deepEqual(result.products, ["lumaga_wild"]);

  // Alter Code muss gelöscht sein
  assert.equal(redis.data.has("lumaga:recovery:code:v1:" + hash), false);

  // Eigner muss auf neue Sitzung gesetzt sein
  assert.equal(redis.data.get("lumaga:recovery:owner:v1:" + customerId), newSession);

  // Sitzungs-Mapping gesetzt
  assert.equal(redis.data.get("lumaga:recovery:session:v1:" + newSession), customerId);
});

test("Doppelte Einlösung desselben Codes schlägt fehl", async () => {
  const customerId = randomUUID();
  const originalSession = randomUUID();
  const sessionA = randomUUID();
  const sessionB = randomUUID();
  const code = createRecoveryCode();
  const hash = hashRecoveryCode(code);

  const redis = makeRedis({
    ["lumaga:recovery:code:v1:" + hash]: makeCodeRecord(customerId),
    ["lumaga:recovery:owner:v1:" + customerId]: originalSession,
    ["lumaga:recovery:index:v1:" + customerId]: hash,
  });

  // Browser A löst zuerst ein — erfolgreich
  const resultA = await rotateRecoveryCode(code, sessionA, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });
  assert.ok(resultA, "Erster Einlösung muss erfolgreich sein");

  // Browser B versucht denselben Code erneut einzulösen — muss scheitern
  const resultB = await rotateRecoveryCode(code, sessionB, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });
  assert.equal(resultB, null, "Zweite Einlösung desselben Codes muss scheitern");
});

test("Ungültiger Code (kein Redis-Eintrag) liefert null", async () => {
  const redis = makeRedis();
  const fakeCode = createRecoveryCode(); // valid format, but not in Redis

  const result = await rotateRecoveryCode(fakeCode, randomUUID(), {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.equal(result, null);
});

test("Code mit gelöschtem RevenueCat-Kauf liefert null", async () => {
  const customerId = randomUUID();
  const session = randomUUID();
  const code = createRecoveryCode();
  const hash = hashRecoveryCode(code);

  const redis = makeRedis({
    ["lumaga:recovery:code:v1:" + hash]: makeCodeRecord(customerId),
    ["lumaga:recovery:owner:v1:" + customerId]: session,
    ["lumaga:recovery:index:v1:" + customerId]: hash,
  });

  // RC reports no purchases (refunded / revoked subscription)
  const result = await rotateRecoveryCode(code, randomUUID(), {
    redis,
    verifyPurchases: async () => [],
  });

  assert.equal(result, null, "Ohne aktive Käufe darf kein neuer Code ausgestellt werden");

  // Alter Code muss noch vorhanden sein (Atomic: nothing changed)
  assert.ok(redis.data.has("lumaga:recovery:code:v1:" + hash), "Alter Code darf bei Fehler nicht gelöscht werden");
});

test("Code-Verlust bei Netzwerkunterbrechung: Browser kann neuen Code ausstellen", async () => {
  // Simulates: rotateRecoveryCode succeeded (Lua ran), HTTP response lost.
  // The redeemer browser (newSession) is now the owner.
  // They should be able to call issueRecoveryCode and get a fresh code.
  const customerId = randomUUID();
  const newSession = randomUUID();

  // State after a successful rotation but before the client received the new code:
  const lostCode = createRecoveryCode();
  const lostHash = hashRecoveryCode(lostCode);

  const redis = makeRedis({
    ["lumaga:recovery:code:v1:" + lostHash]: makeCodeRecord(customerId),
    ["lumaga:recovery:owner:v1:" + customerId]: newSession,
    ["lumaga:recovery:index:v1:" + customerId]: lostHash,
    ["lumaga:recovery:session:v1:" + newSession]: customerId,
  });

  // Client tries to redeem the old code again — but it's the NEW code (they lost
  // the HTTP response, they don't know the new code exists).  They see 403.
  const retryResult = await rotateRecoveryCode(lostCode, newSession, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });
  // The lost code IS in Redis (the Lua set it as the "new code" and the old was deleted)
  // But rotateRecoveryCode called on that code with the same session should work
  // IF the index still points to this code.
  // Let's check: index = lostHash, oldCode = lostHash → match → should succeed.
  // This tests the recovery path: re-issue on network failure.
  assert.ok(retryResult !== null, "Wiederhergestellter Browser kann Code erneut rotieren nach Netzwerkfehler");
});

test("Ungültige Browser-Sitzung wirft Fehler", async () => {
  await assert.rejects(
    () => rotateRecoveryCode(createRecoveryCode(), "kein-uuid", { redis: makeRedis() })
  );
});
