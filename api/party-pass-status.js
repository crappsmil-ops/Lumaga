import { createHmac, timingSafeEqual } from "node:crypto";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PAGES = 20;

// Welche RevenueCat-Käufe zählen: "sandbox" (Testkäufe) oder "production"
// (echte Zahlungen). Ohne Angabe bleibt es beim bisherigen Testmodus.
const PURCHASE_ENVIRONMENT =
  process.env.REVENUECAT_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

 const secret = process.env.LUMAGA_SESSION_SECRET;

if (!secret) {
  return res.status(500).json({
    error: "Session configuration missing",
  });
}

const cookie = (req.headers.cookie || "")
  .split(";")
  .map((part) => part.trim())
  .find((part) => part.startsWith("lumaga_party_session="));

const value = cookie?.slice("lumaga_party_session=".length);
const separator = value?.lastIndexOf(".") ?? -1;

if (separator < 0) {
  return res.status(401).json({ error: "Session required" });
}

const customerId = value.slice(0, separator);
const signature = value.slice(separator + 1);

const expected = createHmac("sha256", secret)
  .update(customerId)
  .digest("base64url");

const validFormat =
  /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(customerId) &&
  /^[A-Za-z0-9_-]{43}$/.test(signature);

const expectedBytes = Buffer.from(expected);
const receivedBytes = Buffer.from(signature);

if (
  !validFormat ||
  expectedBytes.length !== receivedBytes.length ||
  !timingSafeEqual(expectedBytes, receivedBytes)
) {
  return res.status(401).json({ error: "Invalid session" });
}

  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
  const projectId = process.env.REVENUECAT_PROJECT_ID;
  const productId = process.env.REVENUECAT_PARTY_PASS_PRODUCT_ID;

  if (!apiKey || !projectId || !productId) {
    console.error("Missing RevenueCat server configuration");
    return res.status(500).json({ error: "Server configuration missing" });
  }

  const baseUrl =
    "https://api.revenuecat.com/v2/projects/" +
    encodeURIComponent(projectId) +
    "/customers/" +
    encodeURIComponent(customerId) +
    "/purchases";

  let cursor = null;
  let newestPurchase = null;

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(baseUrl);
      url.searchParams.set("limit", "100");
      url.searchParams.set("environment", PURCHASE_ENVIRONMENT);

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
        return res.status(200).json({
          active: false,
          expiresAt: null,
        });
      }

      if (!response.ok) {
        console.error("RevenueCat HTTP status:", response.status);
        return res.status(502).json({
          error: "Purchase verification unavailable",
        });
      }

      const data = await response.json();

      if (!Array.isArray(data.items)) {
        return res.status(502).json({
          error: "Unexpected RevenueCat response",
        });
      }

      for (const purchase of data.items) {
        if (
          purchase.product_id !== productId ||
          purchase.status !== "owned" ||
          !Number.isFinite(purchase.purchased_at)
        ) {
          continue;
        }

        if (
          !newestPurchase ||
          purchase.purchased_at > newestPurchase.purchased_at
        ) {
          newestPurchase = purchase;
        }
      }

      if (!data.next_page) {
        const expiresAt = newestPurchase
          ? newestPurchase.purchased_at + DAY_MS
          : null;

        return res.status(200).json({
          active: expiresAt !== null && Date.now() < expiresAt,
          expiresAt: expiresAt
            ? new Date(expiresAt).toISOString()
            : null,
        });
      }

      const next = new URL(
        data.next_page,
        "https://api.revenuecat.com"
      );

      if (
        next.origin !== "https://api.revenuecat.com" ||
        next.pathname !== new URL(baseUrl).pathname
      ) {
        throw new Error("Unexpected pagination path");
      }

      cursor = next.searchParams.get("starting_after");

      if (!cursor) {
        throw new Error("Missing pagination cursor");
      }
    }

    return res.status(503).json({
      error: "Purchase history exceeds verification limit",
    });
  } catch (error) {
    console.error("Party-pass verification failed:", error);
    return res.status(502).json({
      error: "Purchase verification unavailable",
    });
  }
}
