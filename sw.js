const CACHE = 'codex-2026-07-02-f146c086';
const FILES = ['./codex.html', './sw.js', './manifest.json', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// stale-while-revalidate: serve cache instantly, refresh in the background for next time.
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        var network = fetch(e.request).then(function(r) {
          cache.put(e.request, r.clone());
          return r;
        }).catch(function() { return cached; });
        return cached || network;
      });
    })
  );
});
