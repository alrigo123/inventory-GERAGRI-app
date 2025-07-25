// Very basic service worker for offline caching
this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-cache-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/manifest.json',
      // add other routes or static assets if needed
    ]))
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
