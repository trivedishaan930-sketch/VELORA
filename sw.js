/* Small offline shell cache. Bump CACHE_NAME when shipping a new release. */
const CACHE_NAME = 'velora-shell-v9';
const CORE_ASSETS = [
  './', './index.html', './offline.html', './styles.css', './app.js', './manifest.webmanifest',
  './public/icons/velora-mark.svg', './public/icons/velora-192.png', './public/icons/velora-512.png',
  './public/assets/hero/velora-hero-editorial.svg',
  './public/assets/destinations/maldives.webp', './public/assets/destinations/amalfi-coast.webp',
  './public/assets/destinations/kyoto-garden.webp', './public/assets/experiences/couple-sunset-walk.webp',
  './guide.css', './travel-tools.js', './travel/',
  './travel/india-arrival-ready/', './travel/first-international-trip/', './privacy/', './terms/', './safety/',
  './budget-planner.js', './travel/budget-planner/'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request, copy)); }
      return response;
    }).catch(() => {
      if (request.mode === 'navigate') return caches.match('./offline.html');
      return new Response('This resource is unavailable offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    });
  }));
});
