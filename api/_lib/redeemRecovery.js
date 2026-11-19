import { getLumagaRedis } from "./redis.js";
import { createRecoveryCode, hashRecoveryCode } from "./recoveryCodes.js";
import { getVerifiedPurchases } from "./verifiedPurchases.js";

const CODE_PREFIX = "lumaga:recovery:code:v1:";
const OWNER_PREFIX = "lumaga:recovery:owner:v1:";
const INDEX_PREFIX = "lumaga:recovery:index:v1:";
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export async function rotateRecoveryCode(oldCode, newSessionId, dependencies = {}) {
  if (typeof newSessionId !== "string" || !UUID.test(newSessionId)) {
    throw new Error("Ungueltige Browser-Sitzung");
  }

  const oldHash = hashRecoveryCode(oldCode);
  const redis = dependencies.redis ?? getLumagaRedis();
  const record = await redis.get(CODE_PREFIX + oldHash);

  if (
    !record ||
    typeof record.customerId !== "string" ||
    !UUID.test(record.customerId) ||
    !Array.isArray(record.products)
  ) {
    return null;
  }

  const currentProducts = await (dependencies.verifyPurchases ?? getVerifiedPurchases)(record.customerId);

  if (currentProducts.length === 0) {
    return null;
  }

  const newCode = createRecoveryCode();
  const newHash = hashRecoveryCode(newCode);

  const script = `
    local stored = redis.call("GET", KEYS[1])
    if not stored then return 0 end

    local ok, existing = pcall(cjson.decode, stored)
    if not ok or type(existing) ~= "table" then return 0 end
    if existing.customerId ~= ARGV[1] then return 0 end

    if not redis.call("GET", KEYS[3]) then return 0 end

    if redis.call("GET", KEYS[4]) ~= ARGV[3] then
      return 0
    end

    if redis.call("EXISTS", KEYS[2]) == 1 then
      return 0
    end

    redis.call("SET", KEYS[2], ARGV[5])
    redis.call("DEL", KEYS[1])
    redis.call("SET", KEYS[3], ARGV[2])
    redis.call("SET", KEYS[4], ARGV[4])
    redis.call("SET", KEYS[5], ARGV[1])

    return 1
  `;

  const result = await redis.eval(
    script,
    [
      CODE_PREFIX + oldHash,
      CODE_PREFIX + newHash,
      OWNER_PREFIX + record.customerId,
      INDEX_PREFIX + record.customerId,
      "lumaga:recovery:session:v1:" + newSessionId,
    ],
    [
      record.customerId,
      newSessionId,
      oldHash,
      newHash,
      JSON.stringify({
        customerId: record.customerId,
        products: currentProducts,
      }),
    ]
  );

  if (Number(result) !== 1) {
    return null;
  }

  return {
    newCode,
    customerId: record.customerId,
    products: currentProducts,
  };
}
