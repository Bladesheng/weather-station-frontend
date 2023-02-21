// https://github.com/microsoft/TypeScript/issues/14877
// https://stackoverflow.com/questions/63154992/how-to-get-serviceworker-registration-object-which-is-typescript-friendly
export {}; // export empty object because of tsc --isolatedModules flag
declare const self: ServiceWorkerGlobalScope;

const cacheName = "meteostanice-pwa-v6";
const filesToCache = ["/", "/index.html", "/app.js", "/favicon.ico", "/manifest.webmanifest"];

// Install the service worker and cache all of the app's content
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[SW] Installing new service worker and caching all files");
      await cache.addAll(filesToCache);
    })()
  );
});

// Serve cached content when offline
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isPrecachedRequest = filesToCache.includes(url.pathname);
  const isImageRequest = e.request.destination === "image";

  if (isPrecachedRequest || isImageRequest) {
    e.respondWith(
      (async () => {
        console.log(`[SW] Fetching resource: ${e.request.url}`);
        // go to the cache first and return a cached response if we have one
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(e.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // otherwise, hit the network and add the network response to the cache for later visits
        const fetchedResponse = await fetch(e.request);
        console.log(`[SW] Caching new resource: ${e.request.url}`);
        cache.put(e.request, fetchedResponse.clone());
        return fetchedResponse;
      })()
    );
  }

  if (url.pathname === "/api/readings/events") {
    // TODO: handle SSE
  }
  if (url.pathname === "/api/readings/range") {
    // TODO: handle api calls
  }
});

// cleanup old unused caches
self.addEventListener("activate", (e) => {
  console.log("[SW] Activating new service worker");
  e.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      for (const selectedCacheName of cacheNames) {
        if (selectedCacheName !== cacheName) {
          console.log(`[SW] Deleting old cache: ${selectedCacheName}`);
          caches.delete(selectedCacheName);
        }
      }
    })()
  );
});
