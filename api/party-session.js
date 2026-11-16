
import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

const COOKIE_NAME = "lumaga_party_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function sign(id, secret) {
  return createHmac("sha256", secret)
    .update(id)
    .digest("base64url");
}

function readSession(cookieHeader, secret) {
  const cookie = (cookieHeader || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(COOKIE_NAME + "="));

  if (!cookie) return null;

  const value = cookie.slice(COOKIE_NAME.length + 1);
  const separator = value.lastIndexOf(".");

  if (separator < 0) return null;

  const id = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  if (
    !/^[0-9a-f-]{36}$/.test(id) ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) {
    return null;
  }

  const expected = Buffer.from(sign(id, secret));
  const received = Buffer.from(signature);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  return id;
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const secret = process.env.LUMAGA_SESSION_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: "Session configuration missing",
    });
  }

  let appUserId = readSession(
    req.headers.cookie,
    secret
  );

  if (!appUserId) {
    appUserId = randomUUID();

    const signature = sign(appUserId, secret);

    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${appUserId}.${signature}; ` +
        `HttpOnly; Secure; SameSite=Lax; ` +
        `Path=/; Max-Age=${COOKIE_MAX_AGE}`
    );
  }

  return res.status(200).json({
    appUserId,
  });
}
