// https://github.com/microsoft/TypeScript/issues/14877
// https://stackoverflow.com/questions/63154992/how-to-get-serviceworker-registration-object-which-is-typescript-friendly
export {}; // export empty object because of tsc --isolatedModules flag
declare const self: ServiceWorkerGlobalScope;

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (e) => {
  console.log("[SW] Installing new service worker");
});

// self.addEventListener("fetch", (e) => {
//   console.log(`[SW] Fetching resource: ${e.request.url}`);
// });

self.addEventListener("activate", (e) => {
  console.log("[SW] Activating new service worker");
});
