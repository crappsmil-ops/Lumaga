import { isPurchaseSessionAuthorized } from "./_lib/purchaseAuthorization.js";
import { readPurchaseSession } from "./_lib/purchaseSession.js";
import { getLumagaRedis } from "./_lib/redis.js";
import { getVerifiedPurchases } from "./_lib/verifiedPurchases.js";

export async function handlePurchaseAuthorization(req, res, dependencies = {}) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const readSession = dependencies.readSession ?? readPurchaseSession;
    const sessionId = readSession(req);

    if (!sessionId) {
      return res.status(401).json({ error: "Session required" });
    }

    const redis = dependencies.redis ?? getLumagaRedis();

    const linkedCustomerId = await redis.get(
      "lumaga:recovery:session:v1:" + sessionId
    );

    // Neue Browser verwenden ihre signierte Sitzung als Kaufkennung.
    const customerId = linkedCustomerId || sessionId;

    const activeSession = await redis.get(
      "lumaga:recovery:owner:v1:" + customerId
    );

    if (!isPurchaseSessionAuthorized(activeSession, sessionId)) {
      return res.status(200).json({
        authorized: false,
        recoveryManaged: true,
        products: [],
      });
    }

    const recoveryManaged = activeSession !== null && activeSession !== undefined;

    // Only fetch verified products for recovery-managed browsers — the client
    // falls back to the RevenueCat SDK for non-managed browsers anyway.
    const products = recoveryManaged
      ? await (dependencies.verifyPurchases ?? getVerifiedPurchases)(customerId)
      : [];

    return res.status(200).json({
      authorized: true,
      recoveryManaged,
      products,
    });
  } catch (error) {
    console.error("Browser authorization failed:", error.message);

    return res.status(503).json({
      error: "Purchase authorization unavailable",
    });
  }
}

export default function handler(req, res) {
  return handlePurchaseAuthorization(req, res);
}
