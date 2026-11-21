import { readPurchaseSession } from "./_lib/purchaseSession.js";
import { issueRecoveryCode } from "./_lib/issueRecovery.js";
import { getLumagaRedis } from "./_lib/redis.js";

export async function handleRecoveryIssue(req, res, deps = {}) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const readSession = deps.readSession ?? readPurchaseSession;
    const sessionId = readSession(req);

    if (!sessionId) {
      return res.status(401).json({
        error: "Keine gueltige Kauf-Sitzung",
      });
    }

    const redis = deps.redis ?? getLumagaRedis();

    // Resolve the actual RevenueCat customer ID.
    // After a recovery redemption the session is mapped to the original customer.
    // For first-time buyers the session IS the customer (no entry yet).
    const linkedCustomerId = await redis.get(
      "lumaga:recovery:session:v1:" + sessionId
    );
    const customerId = linkedCustomerId || sessionId;

    // Authorisation check: fail if a different browser already owns this customer.
    const activeSession = await redis.get(
      "lumaga:recovery:owner:v1:" + customerId
    );
    if (activeSession !== null && activeSession !== sessionId) {
      return res.status(403).json({
        error: "Dieser Browser ist fuer diese Kaeufe nicht autorisiert",
      });
    }

    const result = await issueRecoveryCode(customerId, sessionId, deps);

    if (!result) {
      return res.status(403).json({
        error: "Kein berechtigter Dauerkauf gefunden",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Recovery issuance failed:", error.message, error.stack);

    return res.status(503).json({
      error: "Wiederherstellung momentan nicht verfuegbar",
    });
  }
}

export default function handler(req, res) {
  return handleRecoveryIssue(req, res);
}
