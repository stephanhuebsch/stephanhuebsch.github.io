// PAA service worker — network-first with an offline fallback.
// Bump CACHE on release to evict everything the old worker had stored.
const CACHE = "paa-v3";
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

// "Network-first" only means the *browser cache* gets asked first, unless we say
// otherwise: a plain fetch() may be answered from the HTTP cache without ever
// reaching the server. GitHub Pages serves everything with `max-age=600`, and a
// standalone iOS PWA holds those copies far more stubbornly than that suggests —
// so a deploy could land as a fresh index.html next to a stale style.css and
// script.js, which the worker would then happily re-cache. `no-cache` doesn't
// mean "don't cache": the browser still revalidates cheaply and takes a 304,
// it just never skips the server. Navigations are left alone — rebuilding that
// request downgrades its mode from "navigate" to "same-origin".
function revalidate(req) {
  if (req.mode === "navigate") return req;
  try {
    return new Request(req, { cache: "no-cache" });
  } catch (_) {
    return req; // never let a Request quirk take the whole worker down
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // add each asset independently so one missing file can't fail the install
      .then((cache) => Promise.all(CORE.map(
        (url) => cache.add(new Request(url, { cache: "no-cache" })).catch(() => null)
      )))
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
    fetch(revalidate(req))
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
