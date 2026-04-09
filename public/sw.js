const CACHE_NAME = 'isdely-v1';

// Instalación: Forzar que el SW tome el control de inmediato
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación: Limpiar versiones viejas si las hubiera
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch: IMPORTANTE. Sin esto, Chrome no lo considera PWA instalable
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Sin conexión');
    })
  );
});