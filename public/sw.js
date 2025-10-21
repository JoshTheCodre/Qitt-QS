// Service Worker for Qitt PWA
const CACHE_NAME = 'qitt-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/library',
  '/explore',
  '/account',
  '/manifest.json',
  '/default-document.png',
  '/TB.jpeg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new version
        return response || fetch(event.request).then(response =>
          // Cache new responses except for API calls
          !event.request.url.includes('/api/') ?
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response;
            }) : response
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('Qitt', options)
  );
});