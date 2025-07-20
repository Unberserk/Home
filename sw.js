const CACHE_NAME = 'berserk-cache-v1';
const ASSETS = [
  '/f.html',
  '/Assests/CSS/main.css',
  '/Assests/CSS/f.css',
  '/Assests/JS/f.js',
  '/manifest.json',
  '/Assests/Imgs/Logo.png',
  'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => new Response('You are offline', { status: 503, statusText: 'Offline' }))
      );
    })
  );
});
