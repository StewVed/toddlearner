var CACHE = 'toddlearner-2017-1-7';
//https://serviceworke.rs/strategy-cache-only_service-worker_doc.html
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll([
        './'
      , './index.html'
      , './initialize.js'
      , './inputs.js'
      , './loader.js'
      , './main.css'
      , './main.js'
      , './storage.js'//do I need the favicons?!?
    ]);
  }));
});
self.addEventListener('fetch', function(event) {
  //never bother checking online
  event.respondWith(caches.match(event.request));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== CACHE) {
        return caches.delete(cacheName);
      }
    }))
  }));
})
