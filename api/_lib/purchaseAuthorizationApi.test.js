import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { handlePurchaseAuthorization } from "../purchase-authorization.js";

function signedRequest(sessionId, secret) {
  const signature = createHmac("sha256", secret)
    .update("lumaga-purchase-v1:" + sessionId)
    .digest("base64url");

  return {
    method: "POST",
    headers: {
      cookie: `lumaga_purchase_session=${sessionId}.${signature}`,
    },
  };
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("Alter Browser gesperrt, neuer Browser berechtigt", async () => {
  const previousSecret = process.env.LUMAGA_SESSION_SECRET;
  const secret = "lumaga-test-secret";
  process.env.LUMAGA_SESSION_SECRET = secret;

  try {
    const customerId = randomUUID();
    const newSessionId = randomUUID();

    const redis = {
      async get(key) {
        if (key === "lumaga:recovery:session:v1:" + newSessionId) {
          return customerId;
        }
        if (key === "lumaga:recovery:owner:v1:" + customerId) {
          return newSessionId;
        }
        return null;
      },
    };

    const verifyPurchases = async (id) => {
      assert.equal(id, customerId);
      return ["lumaga_wild"];
    };

    const oldRes = response();
    await handlePurchaseAuthorization(
      signedRequest(customerId, secret),
      oldRes,
      { redis, verifyPurchases }
    );

    assert.equal(oldRes.body.authorized, false);
    assert.deepEqual(oldRes.body.products, []);

    const newRes = response();
    await handlePurchaseAuthorization(
      signedRequest(newSessionId, secret),
      newRes,
      { redis, verifyPurchases }
    );

    assert.equal(newRes.body.authorized, true);
    assert.deepEqual(newRes.body.products, ["lumaga_wild"]);
  } finally {
    if (previousSecret === undefined) {
      delete process.env.LUMAGA_SESSION_SECRET;
    } else {
      process.env.LUMAGA_SESSION_SECRET = previousSecret;
    }
  }
});
