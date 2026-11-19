import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { handleRecoveryIssue } from "../recovery-issue.js";

// Minimal in-memory Redis mock (same approach as issueRecovery.test.js)
function makeRedis(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    async get(key) { return data.get(key) ?? null; },
    async eval(script, keys, args) {
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

// Minimal response builder
function makeResponse() {
  let statusCode = 200;
  let _body = null;
  const res = {
    get statusCode() { return statusCode; },
    get body() { return _body; },
    setHeader() { return res; },
    status(code) { statusCode = code; return res; },
    json(data) { _body = data; return res; },
  };
  return res;
}

function makeRequest(sessionId, body = {}) {
  return {
    method: "POST",
    headers: {},
    body,
    _sessionId: sessionId,
  };
}

function readSession(req) {
  return req._sessionId ?? null;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test("Angreifer mit fremder legacyCustomerId erhält keinen Code", async () => {
  const attackerSessionId = randomUUID();
  const victimCustomerId = randomUUID();

  const redis = makeRedis();
  // Track which customer IDs were actually queried
  const queriedIds = [];
  const verifyPurchases = async (id) => {
    queriedIds.push(id);
    // Victim has purchases; attacker's session does not
    if (id === victimCustomerId) return ["lumaga_wild"];
    return [];
  };

  const req = makeRequest(attackerSessionId, { legacyCustomerId: victimCustomerId });
  const res = makeResponse();

  await handleRecoveryIssue(req, res, { readSession, redis, verifyPurchases });

  // Server must NOT query RevenueCat under the victim's UUID
  assert.ok(!queriedIds.includes(victimCustomerId),
    "Server darf RevenueCat nicht mit der Opfer-UUID abfragen");

  // Attacker should be rejected (their session has no purchases)
  assert.equal(res.statusCode, 403);
  assert.ok(
    res.body?.error?.includes("Kein berechtigter Dauerkauf"),
    `Erwartet '...Dauerkauf...', erhalten: ${res.body?.error}`
  );

  // Redis must remain empty — no code was issued
  assert.equal(redis.data.size, 0);
});

test("Widerrufener Browser kann keinen neuen Code ausstellen", async () => {
  const revokedSession = randomUUID();
  const activeSession = randomUUID();
  const customerId = randomUUID();

  // After redemption: owner is the new session; session key maps to customer
  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: activeSession,
    ["lumaga:recovery:session:v1:" + revokedSession]: customerId,
  });

  const req = makeRequest(revokedSession);
  const res = makeResponse();

  await handleRecoveryIssue(req, res, {
    readSession,
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
  });

  assert.equal(res.statusCode, 403);
  assert.ok(
    res.body?.error?.includes("nicht autorisiert"),
    `Erwartet '...nicht autorisiert...', erhalten: ${res.body?.error}`
  );

  // Owner must still be the active session
  assert.equal(
    redis.data.get("lumaga:recovery:owner:v1:" + customerId),
    activeSession
  );
});

test("Autorisierter Browser nach Einlösung kann Code ausstellen", async () => {
  const newSession = randomUUID();
  const customerId = randomUUID();

  // After redemption: owner = newSession, session mapped
  const redis = makeRedis({
    ["lumaga:recovery:owner:v1:" + customerId]: newSession,
    ["lumaga:recovery:session:v1:" + newSession]: customerId,
  });

  const req = makeRequest(newSession);
  const res = makeResponse();

  await handleRecoveryIssue(req, res, {
    readSession,
    redis,
    verifyPurchases: async () => ["lumaga_wild", "lumaga_chaos"],
  });

  assert.equal(res.statusCode, 200);
  assert.match(res.body?.code, /^LMG-[A-Za-z0-9_-]{32}$/);
  assert.deepEqual(res.body?.products, ["lumaga_wild", "lumaga_chaos"]);
});

test("Erster Aufruf ohne vorheriges Mapping erstellt Code (Neu-Käufer)", async () => {
  const sessionId = randomUUID();
  const redis = makeRedis();

  const req = makeRequest(sessionId);
  const res = makeResponse();

  await handleRecoveryIssue(req, res, {
    readSession,
    redis,
    verifyPurchases: async (id) => {
      // Session IS the customer ID for new buyers
      assert.equal(id, sessionId, "Muss mit der eigenen Session-ID abfragen");
      return ["lumaga_wild"];
    },
  });

  assert.equal(res.statusCode, 200);
  assert.match(res.body?.code, /^LMG-[A-Za-z0-9_-]{32}$/);
});

test("Fehlende Sitzung liefert 401", async () => {
  const req = makeRequest(null); // no session
  const res = makeResponse();

  await handleRecoveryIssue(req, res, { readSession });

  assert.equal(res.statusCode, 401);
});

test("Redis-Fehler liefert 503", async () => {
  const sessionId = randomUUID();
  const redis = {
    async get() { throw new Error("Redis unavailable"); },
  };

  const req = makeRequest(sessionId);
  const res = makeResponse();

  await handleRecoveryIssue(req, res, { readSession, redis });

  assert.equal(res.statusCode, 503);
});
