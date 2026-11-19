import { createHmac, timingSafeEqual } from "node:crypto";

export function readPurchaseSession(req) {
  const secret = process.env.LUMAGA_SESSION_SECRET;
  if (!secret) throw new Error("Session configuration missing");

  const cookie = (req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("lumaga_purchase_session="));

  if (!cookie) return null;

  const value = cookie.slice("lumaga_purchase_session=".length);
  const separator = value.lastIndexOf(".");
  if (separator < 0) return null;

  const id = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  if (
    !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id) ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) return null;

  const expected = Buffer.from(
    createHmac("sha256", secret)
      .update("lumaga-purchase-v1:" + id)
      .digest("base64url")
  );
  const received = Buffer.from(signature);

  return expected.length === received.length &&
    timingSafeEqual(expected, received)
    ? id
    : null;
}
