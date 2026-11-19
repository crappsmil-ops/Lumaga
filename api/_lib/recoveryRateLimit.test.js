import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { checkRecoveryRateLimit } from "./recoveryRateLimit.js";

function fakeRedis() {
  const counts = new Map();

  return {
    async eval(_script, keys) {
      const key = keys[0];
      const count = (counts.get(key) || 0) + 1;
      counts.set(key, count);
      return count;
    },
  };
}

test("Ab dem sechsten Versuch pro Sitzung gesperrt", async () => {
  const redis = fakeRedis();
  const session = randomUUID();
  const ipHash = "a".repeat(64);

  for (let i = 1; i <= 6; i++) {
    const result = await checkRecoveryRateLimit(session, ipHash, redis);
    assert.equal(result.allowed, i <= 5);
  }
});

test("Ab dem 31. Versuch pro IP gesperrt", async () => {
  const redis = fakeRedis();
  const ipHash = "b".repeat(64);

  for (let i = 1; i <= 31; i++) {
    const result = await checkRecoveryRateLimit(randomUUID(), ipHash, redis);
    assert.equal(result.allowed, i <= 30);
  }
});

test("Ungueltige IP-Kennung wird abgelehnt", async () => {
  await assert.rejects(
    checkRecoveryRateLimit(randomUUID(), "ungueltig", fakeRedis())
  );
});
