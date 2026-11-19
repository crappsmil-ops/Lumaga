import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { hashRecoveryCode } from "./recoveryCodes.js";
import { issueRecoveryCode } from "./issueRecovery.js";

// Helper: minimal in-memory Redis mock
function makeRedis(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    async get(key) { return data.get(key) ?? null; },
    async eval(script, keys, args) {
      // Simulate the Lua script logic in JavaScript.
      // KEYS: [ownerKey, indexKey, codeKey, sessionKey]
      // ARGV: [customerId, sessionId, codePrefix, hash, record]
      const [ownerKey, indexKey, codeKey, sessionKey] = keys;
      const [customerId, sessionId, codePrefix, hash, record] = args;

      const owner = data.get(ownerKey) ?? null;
      if (owner !== null && owner !== sessionId) return 0;
      if (data.has(codeKey)) return 0;

      const oldHash = data.get(indexKey) ?? null;
      if (oldHash) data.delete(codePrefix + oldHash);

      data.set(ownerKey, sessionId);
      data.set(indexKey, hash);
      data.set(codeKey, JSON.parse(record));
      data.set(sessionKey, customerId);

      return 1;
    },
  };
}

test("Erstausstellung: Code, Produkte und Sitzungsverknüpfung korrekt", async () => {
  const customerId = randomUUID();
  const sessionId = randomUUID();
  const redis = makeRedis();

  const result = await issueRecoveryCode(customerId, sessionId, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.ok(result, "Ergebnis muss existieren");
  assert.match(result.code, /^LMG-[A-Za-z0-9_-]{32}$/);
  assert.deepEqual(result.products, ["lumaga_wild"]);

  const hash = hashRecoveryCode(result.code);
  assert.equal(redis.data.get("lumaga:recovery:owner:v1:" + customerId), sessionId);
  assert.equal(redis.data.get("lumaga:recovery:index:v1:" + customerId), hash);
  assert.deepEqual(redis.data.get("lumaga:recovery:code:v1:" + hash), {
    customerId,
    products: ["lumaga_wild"],
  });
  assert.equal(redis.data.get("lumaga:recovery:session:v1:" + sessionId), customerId);
});

test("Ohne Käufe wird null zurückgegeben", async () => {
  const result = await issueRecoveryCode(randomUUID(), randomUUID(), {
    redis: makeRedis(),
    verifyPurchases: async () => [],
  });
  assert.equal(result, null);
});

test("Autorisierter Browser kann Code erneut ausstellen (Rotation)", async () => {
  const customerId = randomUUID();
  const sessionId = randomUUID();
  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: sessionId,
  });

  const result = await issueRecoveryCode(customerId, sessionId, {
    redis,
    verifyPurchases: async () => ["lumaga_chaos"],
  });

  assert.ok(result, "Zweiter Code muss ausgestellt werden");
  assert.match(result.code, /^LMG-[A-Za-z0-9_-]{32}$/);
});

test("Fremder Browser kann keinen Code ausstellen", async () => {
  const customerId = randomUUID();
  const authorisedSession = randomUUID();
  const attackerSession = randomUUID();

  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: authorisedSession,
  });

  const result = await issueRecoveryCode(customerId, attackerSession, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.equal(result, null, "Fremder Browser darf keinen Code erhalten");
  // Autorisierter Browser bleibt unverändert
  assert.equal(
    redis.data.get("lumaga:recovery:owner:v1:" + customerId),
    authorisedSession
  );
});

test("Nach Einlösung: Neuer Browser (andere sessionId) kann Code ausstellen", async () => {
  const customerId = randomUUID();
  const newSessionId = randomUUID();

  // After redemption: owner is set to newSessionId, session maps newSession → customer
  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: newSessionId,
    ["lumaga:recovery:session:v1:" + newSessionId]: customerId,
  });

  const result = await issueRecoveryCode(customerId, newSessionId, {
    redis,
    verifyPurchases: async () => ["lumaga_wild", "lumaga_chaos"],
  });

  assert.ok(result, "Wiederhergestellter Browser kann Code ausstellen");
  assert.deepEqual(result.products, ["lumaga_wild", "lumaga_chaos"]);

  // Session mapping remains correct
  assert.equal(
    redis.data.get("lumaga:recovery:session:v1:" + newSessionId),
    customerId
  );
});

test("Alter Code wird beim Neuausstellen gelöscht", async () => {
  const customerId = randomUUID();
  const sessionId = randomUUID();
  const oldCode = "LMG-" + "a".repeat(32);
  const oldHash = hashRecoveryCode(oldCode);

  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: sessionId,
    ["lumaga:recovery:index:v1:" + customerId]: oldHash,
    ["lumaga:recovery:code:v1:" + oldHash]: { customerId, products: ["lumaga_wild"] },
  });

  const result = await issueRecoveryCode(customerId, sessionId, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.ok(result);
  assert.equal(
    redis.data.has("lumaga:recovery:code:v1:" + oldHash),
    false,
    "Alter Code muss gelöscht sein"
  );
});

test("Ungültige Kundenkennung wird abgelehnt", async () => {
  await assert.rejects(
    () => issueRecoveryCode("kein-uuid", randomUUID(), { redis: makeRedis() })
  );
});

test("Ungültige Browser-Sitzung wird abgelehnt", async () => {
  await assert.rejects(
    () => issueRecoveryCode(randomUUID(), "kein-uuid", { redis: makeRedis() })
  );
});
