let cache_name = "second-company-v0.2"; // update this when old cache needs to be removed.

// No need to fetch on install, as all uncached sources will automatically be feteched.
let urls_to_cache = [];
self.addEventListener("install", (event) => {
  // console.log("[Service Worker] Installing Service Worker!", event);

  // Todo: enable caching statics later.
  event.waitUntil(caches.open(cache_name).then((cache) => {
    return cache.addAll(urls_to_cache);
  }));
});

self.addEventListener("activate", (event) => {
  // console.log("[Service Worker] Activating Service Worker!", event);

  // Remove outdated cache
  return self.clients.claim();

  // Todo: enable static cache later
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== cache_name;
        }).map(function(cacheName) {
          console.log(cacheName, cache_name);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // console.log("[Service Worker] Fetching ", event.request.url);
  //todo: refetch cached api's in background every minute
  // Caches anything that can not be fetched
  return; // Todo: enable later;

  event.respondWith(
    caches.open(cache_name).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          const only_statics = (
            event.request.method + "").toUpperCase() === "GET" &&
            !event.request.url.toLowerCase().match(/\/api\//) &&
            event.request.url.match(/^http/);
          if (only_statics) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(function(err) {
          console.log("err", err);
        });
      });
    })
  );
});