import { getRecoveryIpHash } from "./_lib/recoveryIp.js";
import { checkRecoveryRateLimit } from "./_lib/recoveryRateLimit.js";
import { readPurchaseSession } from "./_lib/purchaseSession.js";
import { rotateRecoveryCode } from "./_lib/redeemRecovery.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionId = readPurchaseSession(req);

    if (!sessionId) {
      return res.status(401).json({
        error: "Keine gueltige Browser-Sitzung",
      });
    }

    const rateLimit = await checkRecoveryRateLimit(sessionId, getRecoveryIpHash(req));

    if (!rateLimit.allowed) {
      res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      return res.status(429).json({
        error: "Zu viele Versuche. Bitte spaeter erneut versuchen.",
      });
    }
    const code = req.body?.code;

    if (
      typeof code !== "string" ||
      !/^LMG-[A-Za-z0-9_-]{32}$/.test(code)
    ) {
      return res.status(400).json({
        error: "Ungueltiger Wiederherstellungscode",
      });
    }

    const result = await rotateRecoveryCode(code, sessionId);

    if (!result) {
      return res.status(403).json({
        error: "Code ungueltig oder nicht mehr verwendbar",
      });
    }

    return res.status(200).json({
      ok: true,
      code: result.newCode,
      products: result.products,
    });
  } catch (error) {
    console.error("Recovery redemption failed:", error.message);

    return res.status(503).json({
      error: "Wiederherstellung momentan nicht verfuegbar",
    });
  }
}
