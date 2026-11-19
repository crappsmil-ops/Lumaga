import { getLumagaRedis } from "./redis.js";
import { hashRecoveryCode } from "./recoveryCodes.js";

const CODE_PREFIX = "lumaga:recovery:code:v1:";

export async function saveRecoveryCode(code, record) {
  if (
    !record ||
    typeof record !== "object" ||
    typeof record.customerId !== "string" ||
    !Array.isArray(record.products)
  ) {
    throw new Error("Ungueltiger Wiederherstellungsdatensatz");
  }

  const redis = getLumagaRedis();
  const key = CODE_PREFIX + hashRecoveryCode(code);

  const created = await redis.set(key, record, { nx: true });

  if (created !== "OK") {
    throw new Error("Wiederherstellungscode bereits vorhanden");
  }
}

export async function findRecoveryCode(code) {
  const redis = getLumagaRedis();
  const key = CODE_PREFIX + hashRecoveryCode(code);

  return await redis.get(key);
}
