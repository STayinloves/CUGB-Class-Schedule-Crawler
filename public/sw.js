const VERSION = 'v1'
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            return cache.addAll([
                '/course.html',
                '/js/page.js',
                '/js/axios.min.js',
                '/css/material.min.css',
                '/js/material.min.js',
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
                    // 如果当前版本和缓存版本不一致
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).catch(function () {
            return fetch(event.request, {
                credentials: 'include'
            }).then(function (response) {
                return caches.open('v1').then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch(function () {
            return caches.match('/index.manifest');
        })
    );
});