// PAA service worker — network-first with an offline fallback.
const CACHE = "paa-v2";
const CORE = [
  "/",
  "/index.html",
  "/offline.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icon.png",
  "/icon_192.png",
  "/icon_512.png",
  "/fonts/InterVariable.woff2",
  "/fonts/InterVariable-Italic.woff2",
  "/fonts/JetBrainsMono-Regular.woff2",
  "/fonts/JetBrainsMono-Bold.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // add each asset independently so one missing file can't fail the install
      .then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle same-origin GETs; let everything else (external links, POSTs) pass through.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("/offline.html"))
      )
  );
});
