import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readPurchaseSession } from "./purchaseSession.js";

test("Signierte Browser-Sitzung wird sicher geprueft", () => {
  const previous = process.env.LUMAGA_SESSION_SECRET;

  try {
    const secret = "lumaga-test-secret-not-for-production";
    process.env.LUMAGA_SESSION_SECRET = secret;

    const id = randomUUID();
    const otherId = randomUUID();

    const signature = createHmac("sha256", secret)
      .update("lumaga-purchase-v1:" + id)
      .digest("base64url");

    const valid = {
      headers: {
        cookie: `lumaga_purchase_session=${id}.${signature}`
      }
    };

    assert.equal(readPurchaseSession(valid), id);

    const manipulated = {
      headers: {
        cookie: `lumaga_purchase_session=${otherId}.${signature}`
      }
    };

    assert.equal(readPurchaseSession(manipulated), null);
    assert.equal(readPurchaseSession({ headers: {} }), null);
    assert.equal(
      readPurchaseSession({
        headers: { cookie: "lumaga_purchase_session=ungueltig" }
      }),
      null
    );
  } finally {
    if (previous === undefined) {
      delete process.env.LUMAGA_SESSION_SECRET;
    } else {
      process.env.LUMAGA_SESSION_SECRET = previous;
    }
  }
});
