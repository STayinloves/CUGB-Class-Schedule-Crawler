const CACHE_VERSION = 'v2'

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll([
                '/course.html',
                '/js/page.js',
                '/js/axios.min.js',
                '/css/material.min.css',
                '/js/material.min.js',
                '/js/es6-promise.auto.min.js',
                '/api/getCourse',
                '/api/getWeek',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
            ].map(function (urlToPrefetch) {
                return new Request(urlToPrefetch, {
                    // Send user credentials (cookies, basic http auth, etc..) 
                    // if the URL is on the same origin as the calling script.
                    credentials: 'same-origin'
                });
            }));
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).catch(function () {
                return caches.match('/nothing')
            })
        })
    );
});

self.addEventListener('message', function (event) {
    console.log("SW Received Message: " + event.data);
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    console.log(caches)
    event.ports[0].postMessage("Cache cleared");
});