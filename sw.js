var zAppCache = 'toddlearner-2018-10-16';

/*
  trying fetch version from
  https://jakearchibald.com/2014/offline-cookbook/#on-network-response
  very similar, though this version opens the cache first which makes
  more sense to me. Also because anthing not found in the cache should be
  cached, I shouldn't need the install event at all. This should be good
  for if/when things change, so I don't have to change the file list.
*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(zAppCache).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== zAppCache) {
        return caches.delete(cacheName);
      }
    }))
  }))
});
