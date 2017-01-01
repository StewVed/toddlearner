var CACHE = 'toddlearner-2017-1-1';
//https://serviceworke.rs/strategy-cache-only_service-worker_doc.html
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      './'
      , './appmanifest'
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
    })).then(function() {
      console.log('SW: new version active.');
      
      return self.clients.matchAll().then(function(clients) {
        console.log('SW: in forEach clients..');
        clients.forEach(function(client) {
          client.postMessage(msg);
          console.log('SW: clients.client.id is ' + client.id);
        });
      });
      
    });
  }));
})
