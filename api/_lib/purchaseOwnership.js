import { getLumagaRedis } from "./redis.js";

const PREFIX = "lumaga:recovery:owner:v1:";
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function assertId(value) {
  if (typeof value !== "string" || !UUID.test(value)) {
    throw new Error("Ungueltige Sitzungskennung");
  }
}

export async function getActivePurchaseSession(customerId) {
  assertId(customerId);
  return getLumagaRedis().get(PREFIX + customerId);
}

export async function setActivePurchaseSession(customerId, sessionId) {
  assertId(customerId);
  assertId(sessionId);

  await getLumagaRedis().set(PREFIX + customerId, sessionId);
}

export async function isActivePurchaseSession(customerId, sessionId) {
  assertId(customerId);
  assertId(sessionId);

  const activeSession = await getActivePurchaseSession(customerId);
  return activeSession === sessionId;
}

// Atomarer Wechsel: Nur der aktuell berechtigte Browser darf
// die Sitzung auf eine neue Browserkennung umstellen.
export async function transferPurchaseSession(
  customerId,
  previousSessionId,
  newSessionId
) {
  assertId(customerId);
  assertId(previousSessionId);
  assertId(newSessionId);

  const script = `
    if redis.call("GET", KEYS[1]) ~= ARGV[1] then
      return 0
    end

    redis.call("SET", KEYS[1], ARGV[2])
    return 1
  `;

  const result = await getLumagaRedis().eval(
    script,
    [PREFIX + customerId],
    [previousSessionId, newSessionId]
  );

  return Number(result) === 1;
}
