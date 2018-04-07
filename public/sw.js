const CACHE_VERSION = 'v1'

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
                '/api/getWeek'
            ].map(function (urlToPrefetch) {
                return new Request(urlToPrefetch, {
                    credentials: 'include'
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
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .catch(function (err) {
                            console.log(err)
                        });
                }
            })
            .catch(function () {
                return caches.match('/nothing');
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