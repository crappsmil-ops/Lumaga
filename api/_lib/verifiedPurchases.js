// Maps RevenueCat entitlement IDs to the product IDs used by the recovery system.
// Using entitlements (v1 API) is more reliable than product_id lookups across
// platforms because entitlement IDs are consistent for web billing and mobile.
const ENTITLEMENT_TO_PRODUCT = Object.freeze({
  hot:        "lumaga_wild",
  hardcore:   "lumaga_chaos",
  mein_deck:  "lumaga_mein_deck",
  wer_wuerde: "lumaga_wer_wuerde",
  wkw:        "lumaga_wer_kennt_wen",
  bluff:      "lumaga_bluff",
  pantomime:  "lumaga_pantomime",
  never:      "lumaga_never",
});

export async function getVerifiedPurchases(customerId) {
  if (
    typeof customerId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(customerId)
  ) {
    throw new Error("Ungueltige Kundenkennung");
  }

  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;

  if (!apiKey) {
    throw new Error("RevenueCat-Konfiguration fehlt");
  }

  const response = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(customerId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "X-Platform": "web",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("RevenueCat-Kaufpruefung fehlgeschlagen");
  }

  const data = await response.json();
  const entitlements = data?.subscriber?.entitlements ?? {};

  const verified = [];

  for (const [entitlementId, entitlement] of Object.entries(entitlements)) {
    // expires_date is null for lifetime / non-subscription entitlements.
    if (entitlement.expires_date === null) {
      const productId = ENTITLEMENT_TO_PRODUCT[entitlementId];
      if (productId) verified.push(productId);
    }
  }

  return verified;
}
