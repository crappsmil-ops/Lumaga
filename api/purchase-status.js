import { readPurchaseSession } from "./_lib/purchaseSession.js";
import { getVerifiedPurchases } from "./_lib/verifiedPurchases.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const customerId = readPurchaseSession(req);

    if (!customerId) {
      return res.status(401).json({ error: "Session required" });
    }

    const products = await getVerifiedPurchases(customerId);

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Purchase verification failed:", error.message);
    return res.status(502).json({
      error: "Purchase verification unavailable"
    });
  }
}
