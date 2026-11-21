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

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  // Step 1: get customer's active entitlement IDs
  const customerRes = await fetch(
    `https://api.revenuecat.com/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(customerId)}`,
    { headers, cache: "no-store" }
  );

  if (customerRes.status === 404) return [];
  if (!customerRes.ok) {
    let body = "";
    try { body = await customerRes.text(); } catch {}
    throw new Error(`RevenueCat ${customerRes.status}: ${body.slice(0, 200)}`);
  }

  const customerData = await customerRes.json();
  const ae = customerData?.active_entitlements;
  const activeList = Array.isArray(ae) ? ae : ae?.data ?? ae?.items ?? [];

  if (activeList.length === 0) return [];

  // Step 2: get all project entitlements to map internal IDs → identifiers
  const entRes = await fetch(
    `https://api.revenuecat.com/v2/projects/${encodeURIComponent(projectId)}/entitlements?limit=100`,
    { headers, cache: "no-store" }
  );

  if (!entRes.ok) {
    let body = "";
    try { body = await entRes.text(); } catch {}
    throw new Error(`RC entitlements ${entRes.status}: ${body.slice(0, 200)}`);
  }

  const entData = await entRes.json();
  const entItems = entData?.items ?? entData?.data ?? [];

  if (entItems.length === 0) {
    throw new Error(`Entitlements-Liste leer. Keys: ${Object.keys(entData).join(", ")}, sample: ${JSON.stringify(entData).slice(0, 300)}`);
  }

  // Build map: internal entitlement ID → human identifier (e.g. "hot", "hardcore")
  const idToIdentifier = {};
  for (const ent of entItems) {
    const entId = ent.id ?? ent.entitlement_id;
    const identifier = ent.identifier ?? ent.lookup_key;
    if (entId && identifier) {
      idToIdentifier[entId] = identifier;
    }
  }

  const verified = [];
  const now = new Date();

  for (const ae of activeList) {
    const identifier = idToIdentifier[ae.entitlement_id] ?? ae.identifier;
    const expires = ae.expires_at ?? null;
    const isActive = expires === null || new Date(typeof expires === "number" ? expires * 1000 : expires) > now;

    if (isActive && identifier) {
      const productId = ENTITLEMENT_TO_PRODUCT[identifier];
      if (productId) verified.push(productId);
    }
  }

  if (verified.length === 0) {
    throw new Error(`Kein Match. idMap: ${JSON.stringify(idToIdentifier).slice(0, 300)}, active: ${JSON.stringify(activeList).slice(0, 200)}`);
  }

  return verified;
}
