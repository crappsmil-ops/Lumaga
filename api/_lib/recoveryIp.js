import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export function getRecoveryIpHash(req) {
  const secret = process.env.LUMAGA_SESSION_SECRET;
  if (!secret) throw new Error("Session configuration missing");

  // On Vercel the x-forwarded-for header is set by the trusted proxy.
  // In local development (no VERCEL env) we return a fixed dev hash so that
  // the rate-limit path can be tested without a real IP.
  if (!process.env.VERCEL) {
    return createHmac("sha256", secret)
      .update("lumaga-recovery-ip-v1:local-dev")
      .digest("hex");
  }

  const header = req.headers["x-forwarded-for"];
  const ip = typeof header === "string"
    ? header.split(",")[0].trim()
    : "";

  if (!isIP(ip)) {
    throw new Error("Trusted client IP missing");
  }

  return createHmac("sha256", secret)
    .update("lumaga-recovery-ip-v1:" + ip)
    .digest("hex");
}
