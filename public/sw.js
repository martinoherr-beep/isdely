const CACHE_NAME = 'isdely-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Respuesta vacía pero funcional para cumplir el requisito PWA
  event.respondWith(fetch(event.request));
});