import { Redis } from "@upstash/redis";

export function getLumagaRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Redis-Konfiguration fehlt");
  }

  return new Redis({ url, token });
}
