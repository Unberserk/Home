const CACHE_NAME = 'berserk-site-cache-v1';

const ASSETS = [
  '/', // root index.html
  '/f.html',
  '/manifest.json',
  '/Assests/CSS/main.css',
  '/Assests/CSS/f.css',
  '/Assests/JS/f.js',
  '/Assests/Imgs/Logo.png',
  '/Assests/Imgs/Logo-192.png',
  '/Assests/Imgs/Logo-512.png'
  // Add other assets or HTML files if needed
];

// Install event — caches defined assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event — removes old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // Take control of all pages
});

// Fetch event — serves cached files or fetches from network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          return new Response('You are offline and this page is not cached.', {
            headers: { 'Content-Type': 'text/plain' }
          });
        })
      );
    })
  );
});
