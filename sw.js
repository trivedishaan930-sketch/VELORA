/* VELORA multi-page offline shell. Cache pages first, photos independently. */
// Bump this version whenever a precached HTML, CSS, JavaScript or offline asset changes.
const CACHE_NAME = 'velora-shell-v13';
const CORE_ASSETS = [
  './', './index.html', './offline.html', './styles.css', './site-pages.css', './app.js', './manifest.webmanifest',
  './public/icons/velora-mark.svg', './public/icons/velora-192.png', './public/icons/velora-512.png',
  './guide.css', './travel-tools.js', './travel/',
  './experiences/', './style/', './journal/', './journal/postcards-from-blue-hour/',
  './journal/small-gestures/', './journal/a-night-with-no-itinerary/', './about/',
  './travel/india-arrival-ready/', './travel/first-international-trip/',
  './privacy/', './terms/', './safety/', './budget-planner.js', './travel/budget-planner/'
];
const OFFLINE_IMAGES = [
  './public/assets/experiences/couple-sunset-walk.webp',
  './public/assets/destinations/maldives.webp',
  './public/assets/destinations/amalfi-coast.webp',
  './public/assets/destinations/kyoto-garden.webp'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await Promise.all(OFFLINE_IMAGES.map(async asset => {
      try { await cache.add(asset); }
      catch (error) { console.warn('Optional offline image could not be cached:', asset, error); }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => {
      if (request.mode === 'navigate') return caches.match('./offline.html');
      return new Response('This resource is unavailable offline.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    });
  }));
});
