const CACHE_NAME = 'isdely-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Solo para cumplir el requisito de PWA
  event.respondWith(fetch(event.request));
});