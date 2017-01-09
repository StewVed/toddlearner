var CACHE = 'toddlearner-2017-1-9';
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll([
        './index.html'
      , './initialize.js'
      , './inputs.js'
      , './loader.js'
      , './main.css'
      , './main.js'
      , './storage.js'
      //do I need to cache the root? I mean it isn't a file is it?
      , './'
      //do I need to cache the favicons?!?
      , './favicon.svg'
      , './favicon.png'
      , './favicon256.png'
      //how about the appmanifest?!?
      , './appmanifest'
      //what about the serviceWorker file - this file?!?!?
      , './sw.js'
    ])
  }))
});
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request))
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== CACHE) {
        return caches.delete(cacheName);
      }
    }))
  }))
});
