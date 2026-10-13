// 1. Definimos el nombre y la versión de la caché estática
const CACHE_NAME = 'devconnect-shell-v1';

// 2. Listamos todos los recursos estáticos esenciales que forman el App Shell
const STATIC_ASSETS = [
    '/',
    '/index.html',
    'public/css/style.css',
    'src/js/app.js',
    '/manifest.json',
    '/images/icon-1.png',
    '/images/icon-2.png',

];

// FASE DE INSTALACIÓN: Guardando recursos estáticos
self.addEventListener('install', event => {
    console.log('SW: Guardando recursos estáticos en la caché...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Caché abierta con éxito:', CACHE_NAME);
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('SW: Todos los archivos del App Shell fueron almacenados.');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('SW: Falló el almacenamiento en caché del App Shell:', err);
            })
    );
});

// FASE DE ACTIVACIÓN
self.addEventListener('activate', event => {
    console.log('SW: Activado y listo.');
    return self.clients.claim();
});

// FASE FETCH
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});