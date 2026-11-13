importScripts('./precache-manifest.js');
var CACHE_NAME = 'workout-v16_6-20261113';
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(self.WORKOUT_PRECACHE);
  }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.filter(function(name) {
      return name.indexOf('workout-') === 0 && name !== CACHE_NAME;
    }).map(function(name) { return caches.delete(name); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(event) {
  if(event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if(event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(function(response) {
      if(response.ok) {var clone=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.put('./index.html',clone);}));}
      return response;
    }).catch(function() {return caches.match('./index.html');}));
  } else {
    event.respondWith(caches.match(event.request).then(function(cached) {return cached || fetch(event.request);}));
  }
});
