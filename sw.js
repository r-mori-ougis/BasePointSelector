const CACHE_NAME = 'bps-v1.0.0-phase3-20260704';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/viewer.css',
  './css/dialog.css',
  './js/app.js',
  './js/viewer.js',
  './js/calibration.js',
  './js/transform.js',
  './js/gps.js',
  './js/storage.js',
  './js/project.js',
  './js/candidate.js',
  './js/photo.js',
  './js/ui.js',
  './js/utils.js',
  './lib/pdf.min.js',
  './lib/pdf.worker.min.js',
  './lib/proj4.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
