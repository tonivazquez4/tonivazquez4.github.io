// Cambiamos a la versión 2 para forzar a los móviles a borrar el error
const CACHE_NAME = 'tony-vazquez-v2'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/conciertos.html',
  '/galeria.html',
  '/videos.html',
  '/logoTV.png',
  '/favicon.png',
  '/Alma de Rock.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activa la actualización de golpe
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Aquí hace limpieza general y borra la caché antigua que tenía el error
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // ESTRATEGIA NUEVA: Busca primero en internet. Si falla, usa la caché.
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});