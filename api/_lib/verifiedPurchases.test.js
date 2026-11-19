import test from "node:test";
import assert from "node:assert/strict";
import { getVerifiedPurchases } from "./verifiedPurchases.js";

test("Nur gueltige Dauerkäufe werden freigegeben", async () => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.REVENUECAT_SECRET_API_KEY;
  const oldProject = process.env.REVENUECAT_PROJECT_ID;

  try {
    process.env.REVENUECAT_SECRET_API_KEY = "test-key";
    process.env.REVENUECAT_PROJECT_ID = "test-project";

    globalThis.fetch = async (url) => {
      const requestUrl = new URL(url);

      assert.equal(requestUrl.searchParams.get("environment"), "sandbox");

      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            { product_id: "lumaga_wild", status: "owned" },
            { product_id: "lumaga_chaos", status: "refunded" },
            { product_id: "lumaga_party_pass_24h", status: "owned" }
          ],
          next_page: null
        })
      };
    };

    const products = await getVerifiedPurchases(
      "123e4567-e89b-42d3-a456-426614174000"
    );

    assert.deepEqual(products, ["lumaga_wild"]);
  } finally {
    globalThis.fetch = oldFetch;

    if (oldKey === undefined) delete process.env.REVENUECAT_SECRET_API_KEY;
    else process.env.REVENUECAT_SECRET_API_KEY = oldKey;

    if (oldProject === undefined) delete process.env.REVENUECAT_PROJECT_ID;
    else process.env.REVENUECAT_PROJECT_ID = oldProject;
  }
});
