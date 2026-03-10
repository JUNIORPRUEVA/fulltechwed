const CACHE_NAME = 'fulltech-v24';
const APP_SHELL = [
  '/',
  '/index.html',
  '/trabajos.html',
  '/politica.html',
  '/login.html',
  '/styles.css?v=20260310b',
  '/styles.css?v=20260310h',
  '/styles.css?v=20260310i',
  '/styles.css?v=20260310j',
  '/styles.css?v=20260310k',
  '/styles.css?v=20260310l',
  '/styles.css?v=20260310m',
  '/styles.css?v=20260310n',
  '/styles.css?v=20260310o',
  '/styles.css?v=20260310p',
  '/styles.css?v=20260310q',
  '/styles.css?v=20260310r',
  '/styles.css?v=20260310s',
  '/admin.css?v=20260310b',
  '/login.css?v=20260310b',
  '/app.js?v=20260310b',
  '/app.js?v=20260310h',
  '/app.js?v=20260310k',
  '/app.js?v=20260310l',
  '/app.js?v=20260310m',
  '/trabajos.js?v=20260310b',
  '/trabajos.js?v=20260310k',
  '/admin.js?v=20260310b',
  '/login.js?v=20260310b',
  '/content-manager.js?v=20260310b',
  '/content-manager.js?v=20260310e',
  '/content-manager.js?v=20260310k',
  '/content-manager.js?v=20260310l',
  '/policy.js?v=20260310a',
  '/policy.js?v=20260310b',
  '/policy.js?v=20260310c',
  '/manifest.webmanifest',
  '/manifest.webmanifest?v=20260310b',
  '/assets/icon-192.svg',
  '/assets/icon-512.svg',
  '/assets/logo-fulltech.png',
  '/assets/whatsapp.svg',
  '/assets/services/camaras.svg',
  '/assets/services/cerco-electrico.svg',
  '/assets/services/intercom.svg',
  '/assets/services/alarmas.svg',
  '/assets/services/motores-portones.svg',
  '/assets/services/mantenimiento.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (requestUrl.pathname === '/admin' || requestUrl.pathname === '/admin.html') {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          const pathName = requestUrl.pathname;
          caches.open(CACHE_NAME).then((cache) => cache.put(pathName, responseClone));
          return networkResponse;
        })
        .catch(() => {
          const pathName = requestUrl.pathname;
          return caches.match(pathName).then((cachedPage) => cachedPage || caches.match('/index.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
