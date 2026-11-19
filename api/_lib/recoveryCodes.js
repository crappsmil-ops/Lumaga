import { randomBytes, createHash } from "node:crypto";

const CODE_PATTERN = /^LMG-[A-Za-z0-9_-]{32}$/;

export function createRecoveryCode() {
  return "LMG-" + randomBytes(24).toString("base64url");
}

export function hashRecoveryCode(code) {
  if (typeof code !== "string" || !CODE_PATTERN.test(code)) {
    throw new Error("Ungueltiger Wiederherstellungscode");
  }

  return createHash("sha256")
    .update("lumaga-recovery-v1:" + code)
    .digest("hex");
}
