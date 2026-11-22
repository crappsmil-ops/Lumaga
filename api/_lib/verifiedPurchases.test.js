import test from "node:test";
import assert from "node:assert/strict";
import { getVerifiedPurchases } from "./verifiedPurchases.js";

const CUSTOMER_ID = "123e4567-e89b-42d3-a456-426614174000";

async function withRevenueCatMock(responses, run) {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.REVENUECAT_SECRET_API_KEY;
  const oldProject = process.env.REVENUECAT_PROJECT_ID;
  const calls = [];

  try {
    process.env.REVENUECAT_SECRET_API_KEY = "test-key";
    process.env.REVENUECAT_PROJECT_ID = "test-project";

    globalThis.fetch = async (url, options) => {
      const requestUrl = new URL(url);
      calls.push({ url: requestUrl, options });

      assert.equal(options?.headers?.Authorization, "Bearer test-key");

      const key = requestUrl.pathname.endsWith("/entitlements")
        ? "entitlements"
        : "customer";
      const response = responses[key];

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: async () => response.body,
      };
    };

    return await run(calls);
  } finally {
    globalThis.fetch = oldFetch;

    if (oldKey === undefined) delete process.env.REVENUECAT_SECRET_API_KEY;
    else process.env.REVENUECAT_SECRET_API_KEY = oldKey;

    if (oldProject === undefined) delete process.env.REVENUECAT_PROJECT_ID;
    else process.env.REVENUECAT_PROJECT_ID = oldProject;
  }
}

test("Nur aktive, bekannte Dauerkäufe werden freigegeben", async () => {
  const past = new Date(Date.now() - 60_000).toISOString();
  const future = new Date(Date.now() + 60_000).toISOString();

  await withRevenueCatMock(
    {
      customer: {
        status: 200,
        body: {
          active_entitlements: {
            items: [
              { entitlement_id: "ent_hot", expires_at: null },
              { entitlement_id: "ent_hardcore", expires_at: past },
              { entitlement_id: "ent_deck", expires_at: future },
              { entitlement_id: "ent_party_pass", expires_at: future },
            ],
          },
        },
      },
      entitlements: {
        status: 200,
        body: {
          items: [
            { id: "ent_hot", lookup_key: "hot" },
            { id: "ent_hardcore", lookup_key: "hardcore" },
            { id: "ent_deck", lookup_key: "mein_deck" },
            { id: "ent_party_pass", lookup_key: "party_pass_24h" },
          ],
        },
      },
    },
    async (calls) => {
      const products = await getVerifiedPurchases(CUSTOMER_ID);

      // hot: dauerhaft; hardcore: abgelaufen; mein_deck: aktiv;
      // party_pass_24h: kein Dauerkauf und daher nicht in der Liste.
      assert.deepEqual(products, ["lumaga_wild", "lumaga_mein_deck"]);
      assert.equal(calls.length, 2);
      assert.match(calls[0].url.pathname, /\/projects\/test-project\/customers\//);
    }
  );
});

test("Unbekannter Kunde (404) liefert keine Käufe", async () => {
  await withRevenueCatMock(
    { customer: { status: 404, body: {} }, entitlements: { status: 200, body: { items: [] } } },
    async (calls) => {
      assert.deepEqual(await getVerifiedPurchases(CUSTOMER_ID), []);
      assert.equal(calls.length, 1, "Ohne Kunde keine Entitlement-Abfrage");
    }
  );
});

test("RevenueCat-Fehler wird nicht als 'keine Käufe' verschluckt", async () => {
  await withRevenueCatMock(
    { customer: { status: 500, body: {} }, entitlements: { status: 200, body: { items: [] } } },
    async () => {
      await assert.rejects(() => getVerifiedPurchases(CUSTOMER_ID), /Kaufpruefung fehlgeschlagen/);
    }
  );
});

test("Ungültige Kundenkennung wird abgelehnt", async () => {
  await assert.rejects(() => getVerifiedPurchases("../admin"), /Ungueltige Kundenkennung/);
});
