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
  const projectId = process.env.REVENUECAT_PROJECT_ID;

  if (!apiKey) throw new Error("RevenueCat-Konfiguration fehlt");
  if (!projectId) throw new Error("RevenueCat-Projekt-ID fehlt");

  const url = new URL(
    `https://api.revenuecat.com/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(customerId)}`
  );
  url.searchParams.append("expand[]", "active_entitlements.entitlement");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) return [];

  if (!response.ok) {
    let body = "";
    try { body = await response.text(); } catch {}
    throw new Error(`RevenueCat ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();

  const ae = data?.active_entitlements;
  const rawEntitlements =
    (Array.isArray(ae) ? ae : null) ??
    ae?.data ??
    ae?.items ??
    data?.entitlements?.data ??
    null;

  if (!rawEntitlements) {
    throw new Error(`RC V2 ae: ${JSON.stringify(ae)?.slice(0, 300)}`);
  }

  const verified = [];
  const now = new Date();

  for (const entitlement of rawEntitlements) {
    const id = entitlement.entitlement?.identifier
      ?? entitlement.identifier
      ?? entitlement.product_identifier
      ?? entitlement.entitlement_identifier;
    const expires = entitlement.expires_at ?? entitlement.expires_date ?? null;
    const isActive = expires === null || new Date(typeof expires === "number" ? expires * 1000 : expires) > now;

    if (isActive && id) {
      const productId = ENTITLEMENT_TO_PRODUCT[id];
      if (productId) verified.push(productId);
    }
  }

  if (verified.length === 0) {
    throw new Error(`Entitlements leer. Raw: ${JSON.stringify(rawEntitlements).slice(0, 400)}`);
  }

  return verified;
}
