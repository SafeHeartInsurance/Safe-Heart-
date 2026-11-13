/* Safe Heart service worker: lets the app open offline.
   If you change index.html, styles.css or app.js, bump VERSION (e.g. v2) so phones get the new files. */
var VERSION = "safeheart-v2";
var SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "config.json",
  "shows.json",
  "manifest.webmanifest",
  "icons/logo.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch form sites

  var isData = /\.json$/.test(url.pathname);
  var isPage = req.mode === "navigate";

  if (isData || isPage) {
    // Network first: your latest shows/links/page, with an offline fallback.
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(isPage ? "index.html" : req, copy); });
        return res;
      }).catch(function () {
        return caches.match(isPage ? "index.html" : req, { ignoreSearch: true });
      })
    );
    return;
  }

  // Cache first for icons, styles and scripts.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
