var zAppCache = 'toddlearner-2017-1-11';
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(zAppCache).then(function(cache) {
    return cache.addAll([
        './'
      , './initialize.js'
      , './inputs.js'
      , './loader.js'
      , './main.css'
      , './main.js'
      , './storage.js'
    /*
      actual storage in the dev tpools/application:
      0	http://127.0.0.1/edsa-Toddlearner/	OK	
      1	http://127.0.0.1/edsa-Toddlearner/initialize.js	OK	
      2	http://127.0.0.1/edsa-Toddlearner/inputs.js	OK	
      3	http://127.0.0.1/edsa-Toddlearner/loader.js	OK	
      4	http://127.0.0.1/edsa-Toddlearner/main.css	OK	
      5	http://127.0.0.1/edsa-Toddlearner/main.js	OK	
      6	http://127.0.0.1/edsa-Toddlearner/storage.js	OK

      so, no index.html, appmanifest, favicons, or sw.js(serviceworker file)
    */

    ])
  }))
});
self.addEventListener('fetch', function(event) {
  /*
    new try - back to rolling release version, though instead of
    THEN fetching the file and (re-)caching it (if needed) - 
    this version returns the cached version if there, and if not,
    it tries to get the file from online - if successful, cache it.
  */
  event.respondWith(
    caches.match(event.request).then(function(cacheResponse) {
      return cacheResponse || fetch(event.request).then(function(netResponse) {
        return caches.open(zAppCache).then(function(cache) {
          cache.put(event.request, netResponse.clone());
          console.log('flle not found in cache!');
          return netResponse;
        });
      });
    })
  );

  /*
    event.respondWith(caches.match(event.request))
    just this on it's own does works only for a day.
    perhaps I was caching too many things?

    YES I WAS!! look at the install eventListener for details.

    Blox let's just leave this version in since it should always
    find the wanted file in the cache anyway.
  */

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
