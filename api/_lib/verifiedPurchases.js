import { RECOVERABLE_PRODUCTS } from "./recoveryProducts.js";

export async function getVerifiedPurchases(customerId) {
  if (
    typeof customerId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(customerId)
  ) {
    throw new Error("Ungueltige Kundenkennung");
  }

  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
  const projectId = process.env.REVENUECAT_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error("RevenueCat-Konfiguration fehlt");
  }

  const baseUrl =
    `https://api.revenuecat.com/v2/projects/` +
    `${encodeURIComponent(projectId)}/customers/` +
    `${encodeURIComponent(customerId)}/purchases`;

  const verified = new Set();
  let cursor = null;

  for (let page = 0; page < 20; page++) {
    const url = new URL(baseUrl);
    url.searchParams.set("limit", "100");
    // REVENUECAT_ENVIRONMENT defaults to "sandbox" for safety.
    // Set it to "production" in Vercel environment variables for live purchases.
    const environment = process.env.REVENUECAT_ENVIRONMENT || "sandbox";
    url.searchParams.set("environment", environment);

    if (cursor) {
      url.searchParams.set("starting_after", cursor);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("RevenueCat-Kaufpruefung fehlgeschlagen");
    }

    const data = await response.json();

    if (!Array.isArray(data.items)) {
      throw new Error("Ungueltige RevenueCat-Antwort");
    }

    for (const purchase of data.items) {
      if (
        purchase.status === "owned" &&
        Object.hasOwn(
          RECOVERABLE_PRODUCTS,
          purchase.product_id
        )
      ) {
        verified.add(purchase.product_id);
      }
    }

    if (!data.next_page) {
      return [...verified];
    }

    const next = new URL(
      data.next_page,
      "https://api.revenuecat.com"
    );

    if (
      next.origin !== "https://api.revenuecat.com" ||
      next.pathname !== new URL(baseUrl).pathname
    ) {
      throw new Error("Ungueltige RevenueCat-Seitenfolge");
    }

    cursor = next.searchParams.get("starting_after");

    if (!cursor) {
      throw new Error("Fehlender Seitenzeiger");
    }
  }

  throw new Error("Kaufhistorie zu umfangreich");
}
