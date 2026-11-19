import { getLumagaRedis } from "./redis.js";
import { getVerifiedPurchases } from "./verifiedPurchases.js";
import { createRecoveryCode, hashRecoveryCode } from "./recoveryCodes.js";

const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

// Issues or replaces the recovery code for a customer.
//
// customerId – the RevenueCat customer ID (may differ from sessionId after a redemption)
// sessionId  – the current browser's signed session cookie ID
//
// Security: the Lua script checks that the CURRENT SESSION owns the customer record
// before issuing a new code. This prevents a different browser from replacing the code.
export async function issueRecoveryCode(customerId, sessionId, deps = {}) {
  if (typeof customerId !== "string" || !UUID.test(customerId)) {
    throw new Error("Ungueltige Kundenkennung");
  }
  if (typeof sessionId !== "string" || !UUID.test(sessionId)) {
    throw new Error("Ungueltige Browser-Sitzung");
  }

  // The caller must supply a customer ID derived from a server-validated session;
  // this call verifies the purchases under that ID via the RevenueCat REST API.
  const products = await (deps.verifyPurchases ?? getVerifiedPurchases)(customerId);

  if (products.length === 0) {
    return null;
  }

  const code = createRecoveryCode();
  const hash = hashRecoveryCode(code);

  const ownerKey   = "lumaga:recovery:owner:v1:" + customerId;
  const indexKey   = "lumaga:recovery:index:v1:" + customerId;
  const codePrefix = "lumaga:recovery:code:v1:";
  const codeKey    = codePrefix + hash;
  const sessionKey = "lumaga:recovery:session:v1:" + sessionId;

  // Atomic Lua script:
  // - Fails if another session already owns this customer record.
  // - Deletes any previous code entry for this customer.
  // - Writes the new code and updates all bookkeeping keys atomically.
  //
  // KEYS[1] = ownerKey   (lumaga:recovery:owner:v1:<customerId>)
  // KEYS[2] = indexKey   (lumaga:recovery:index:v1:<customerId>)
  // KEYS[3] = codeKey    (lumaga:recovery:code:v1:<newHash>)
  // KEYS[4] = sessionKey (lumaga:recovery:session:v1:<sessionId>)
  //
  // ARGV[1] = customerId
  // ARGV[2] = sessionId  ← owner check uses THIS, not customerId
  // ARGV[3] = codePrefix
  // ARGV[4] = newHash
  // ARGV[5] = record (JSON)
  const script = `
    local owner = redis.call("GET", KEYS[1])

    if owner and owner ~= ARGV[2] then
      return 0
    end

    if redis.call("EXISTS", KEYS[3]) == 1 then
      return 0
    end

    local oldHash = redis.call("GET", KEYS[2])
    if oldHash then
      redis.call("DEL", ARGV[3] .. oldHash)
    end

    redis.call("SET", KEYS[1], ARGV[2])
    redis.call("SET", KEYS[2], ARGV[4])
    redis.call("SET", KEYS[3], ARGV[5])
    redis.call("SET", KEYS[4], ARGV[1])

    return 1
  `;

  const record = JSON.stringify({ customerId, products });

  const redis = deps.redis ?? getLumagaRedis();
  const result = await redis.eval(
    script,
    [ownerKey, indexKey, codeKey, sessionKey],
    [customerId, sessionId, codePrefix, hash, record]
  );

  if (Number(result) !== 1) {
    return null;
  }

  return { code, products };
}
