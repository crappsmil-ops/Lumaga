// Lumaga Service Worker
// Strategie: immer zuerst das Netz (damit Updates sofort ankommen).
// Nur wenn keine Verbindung besteht, wird die zuletzt geladene Version
// aus dem Zwischenspeicher genutzt. Kauf-/Server-Anfragen (/api/) und
// fremde Adressen (RevenueCat, Stripe, Support) werden nie zwischengespeichert.

const CACHE = "lumaga-v1";
const MAX_ENTRIES = 120;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function trimCache(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_ENTRIES; i++) {
    await cache.delete(keys[i]);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          await cache.put(request, response.clone());
          trimCache(cache);
        }
        return response;
      } catch (error) {
        const cached =
          (await cache.match(request)) ||
          (request.mode === "navigate" ? await cache.match("/") : undefined);
        if (cached) return cached;
        throw error;
      }
    })()
  );
});
