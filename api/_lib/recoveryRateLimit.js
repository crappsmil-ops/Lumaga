import { getLumagaRedis } from "./redis.js";

const LIMIT = 5;
const WINDOW_SECONDS = 15 * 60;

export async function checkRecoveryRateLimit(sessionId, ipHash, redis = getLumagaRedis()) {
  if (
    typeof sessionId !== "string" ||
    !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(sessionId)
  ) {
    throw new Error("Ungueltige Sitzung");
  }

  if (
    typeof ipHash !== "string" ||
    !/^[0-9a-f]{64}$/.test(ipHash)
  ) {
    throw new Error("Ungueltige IP-Kennung");
  }

  const key = "lumaga:recovery:rate:v1:" + sessionId;
  const ipKey = "lumaga:recovery:iprate:v1:" + ipHash;

  const script = `
    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return count
  `;

  const [count, ipCount] = await Promise.all([
    redis.eval(script, [key], [WINDOW_SECONDS]),
    redis.eval(script, [ipKey], [WINDOW_SECONDS]),
  ]);

  return {
    allowed: Number(count) <= LIMIT && Number(ipCount) <= 30,
    retryAfterSeconds: WINDOW_SECONDS,
  };
}
