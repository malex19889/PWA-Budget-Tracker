const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/css/styles.css",
  "/dist/index.bundle.js",
  "/dist/db.bundle.js",
  "/assets/icons/icon-192x192.png",
  "https://unpkg.com/dexie@latest/dist/dexie.js",
  "/assets/script/db.js",
  "/assets/script/index.js",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.url.includes(self.location.origin)) {
    event.respondWith(
      caches.open(RUNTIME).then(cache => {
        return fetch(event.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            console.log(err);
            return cache.match(event.request);
          });
      })
    );

    return;
  }

  event.respondWith(
    caches.open(RUNTIME).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );
});