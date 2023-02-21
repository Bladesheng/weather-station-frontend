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
// self.addEventListener("fetch", (e) => {
//   e.respondWith(
//     (async () => {
//       const r = await caches.match(e.request);
//       console.log(`[SW] Fetching resource: ${e.request.url}`);
//       if (r) {
//         return r;
//       }

//       const response = await fetch(e.request);
//       const cache = await caches.open(cacheName);
//       console.log(`[SW] Caching new resource: ${e.request.url}`);
//       cache.put(e.request, response.clone());
//       return response;
//     })()
//   );
// });

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
