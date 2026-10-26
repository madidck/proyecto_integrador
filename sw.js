// sw.js - Service Worker Completo con Precaché e Intercepción Fetch

const CACHE_NAME = 'devconnect-shell-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/public/css/style.css',
    '/src/js/app.js',
    '/manifest.json',
    '/images/icon-1.png',
    '/images/icon-2.png'
];

// FASE DE INSTALACIÓN (Precaché del App Shell)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// FASE DE ACTIVACIÓN (Toma de control)
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// FASE FETCH: Estrategia Cache First (Caché primero con respaldo en Red)
self.addEventListener('fetch', event => {
    // Interceptamos la respuesta HTTP
    event.respondWith(
        // 1. Buscamos si el recurso solicitado ya está guardado en la caché
        caches.match(event.request)
            .then(responseInCache => {
                // Si se encuentra en caché, lo devolvemos desde el disco local
                if (responseInCache) {
                    console.log('SW: Sirviendo desde Caché ->', event.request.url);
                    return responseInCache;
                }

                // Si no está en caché, intentamos obtenerlo de la red (Internet)
                console.log('SW: No está en caché. Buscando en Red ->', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.error('SW: Error en fetch y recurso no disponible en caché:', error);
            })
    );
});