import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { handlePurchaseAuthorization } from "../purchase-authorization.js";

function makeReq(cookieId) {
  return {
    method: "POST",
    headers: { cookie: cookieId ? `lumaga_purchase_session=${cookieId}` : "" },
  };
}

function makeRes() {
  let _status = 200;
  let _body = null;
  return {
    get statusCode() { return _status; },
    get body() { return _body; },
    setHeader() {},
    status(code) { _status = code; return this; },
    json(data) { _body = data; return this; },
  };
}

function makeRedis(ownerMap = {}, sessionMap = {}) {
  return {
    async get(key) {
      if (key.startsWith("lumaga:recovery:session:v1:")) {
        const sessionId = key.replace("lumaga:recovery:session:v1:", "");
        return sessionMap[sessionId] ?? null;
      }
      if (key.startsWith("lumaga:recovery:owner:v1:")) {
        const customerId = key.replace("lumaga:recovery:owner:v1:", "");
        return ownerMap[customerId] ?? null;
      }
      return null;
    },
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test("Autorisierter Browser erhält authorized=true und recoveryManaged=true", async () => {
  const sessionId = randomUUID();
  const products = ["lumaga_wild"];

  const redis = makeRedis(
    { [sessionId]: sessionId },     // owner → same session
    {}                               // no session-to-customer mapping (session IS customer)
  );

  const req = makeReq(sessionId);
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {
    redis,
    verifyPurchases: async () => products,
    readSession: () => sessionId,
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.authorized, true);
  assert.equal(res.body.recoveryManaged, true);
  assert.deepEqual(res.body.products, products);
});

test("Widerrufener Browser erhält authorized=false und recoveryManaged=true", async () => {
  const mySession = randomUUID();
  const foreignSession = randomUUID();
  const customerId = randomUUID();

  // customerId's owner is a DIFFERENT session (the new browser after recovery)
  const redis = makeRedis(
    { [customerId]: foreignSession },
    { [mySession]: customerId }     // my session maps to customer who is now owned by foreign
  );

  const req = makeReq(mySession);
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {
    redis,
    verifyPurchases: async () => ["lumaga_wild"],
    readSession: () => mySession,
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.authorized, false);
  assert.equal(res.body.recoveryManaged, true, "recoveryManaged muss auch bei Ablehnung true sein");
  assert.deepEqual(res.body.products, []);
});

test("Neuer Browser ohne Redis-Eintrag: authorized=true, recoveryManaged=false", async () => {
  const sessionId = randomUUID();
  const redis = makeRedis({}, {}); // nothing in Redis yet

  const req = makeReq(sessionId);
  const res = makeRes();

  let verifyCalled = false;

  await handlePurchaseAuthorization(req, res, {
    redis,
    verifyPurchases: async () => {
      verifyCalled = true;
      return ["lumaga_chaos"];
    },
    readSession: () => sessionId,
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.authorized, true);
  assert.equal(res.body.recoveryManaged, false, "Ohne Redis-Eigner kein Recovery-Managed-Status");
  // Nicht verwaltete Browser pruefen ihre Kaeufe selbst ueber das RevenueCat-SDK.
  assert.deepEqual(res.body.products, []);
  assert.equal(verifyCalled, false, "Ohne Recovery-Verwaltung keine Server-Kaufpruefung");
});

test("Fehlende Sitzung liefert 401", async () => {
  const req = makeReq(null);
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {
    redis: makeRedis(),
    readSession: () => null,
  });

  assert.equal(res.statusCode, 401);
});

test("Methode GET liefert 405", async () => {
  const req = { method: "GET", headers: {} };
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {});

  assert.equal(res.statusCode, 405);
});

test("Redis-Fehler liefert 503", async () => {
  const req = makeReq(randomUUID());
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {
    redis: { async get() { throw new Error("Redis down"); } },
    readSession: () => randomUUID(),
  });

  assert.equal(res.statusCode, 503);
});

test("Autorisierter Browser nach Einlösung: Sitzungs-Mapping zu anderem customerId", async () => {
  const sessionId = randomUUID();
  const customerId = randomUUID();
  const products = ["lumaga_wild", "lumaga_chaos"];

  const redis = makeRedis(
    { [customerId]: sessionId },   // customerId's owner is this session
    { [sessionId]: customerId }    // session maps to customerId
  );

  const req = makeReq(sessionId);
  const res = makeRes();

  await handlePurchaseAuthorization(req, res, {
    redis,
    verifyPurchases: async () => products,
    readSession: () => sessionId,
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.authorized, true);
  assert.equal(res.body.recoveryManaged, true);
  assert.deepEqual(res.body.products, products);
});
