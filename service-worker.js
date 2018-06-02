
var version = '2018.018';
var resources = [
    '/assets/config/manifest.json',
    '/',
//    '/assets/js/jquery-sakura.min.js',
    '/assets/img/icon.webp',
    '/assets/img/background.webp',
    '/assets/css/main.css',
    '/assets/css/font/icomoon.css',
    '/assets/css/font/IcoMoon-Free.ttf',
//    '/assets/css/jquery-sakura.min.css',
    'https://fonts.googleapis.com/css?family=Quicksand:400,500|Rajdhani',
//    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://raw.githubusercontent.com/leewp14/temp/master/AmaLee%20-%20STYX%20HELIX.webm',
    '/docs/',
    '/docs/_data/override.css',
    '/docs/_navbar.md',
    '/docs/_sidebar.md',
//    'https://discordbots.org/api/widget/413385786344472576.svg',
    '/docs/commands.md',
    '/docs/partnership.md',
    '/docs/README.md',
    '/docs/support.md',
    '//unpkg.com/docsify/lib/themes/vue.css',
    '//unpkg.com/docsify/lib/docsify.min.js',
    '//unpkg.com/docsify/lib/plugins/emoji.min.js',
    '//unpkg.com/docsify/lib/plugins/search.min.js',
    'https://fonts.googleapis.com/css?family=Roboto+Mono|Source+Sans+Pro:300,400,600',
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(version + '.fundamentals')
            .then(function (cache) {
                return cache.addAll(resources);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== 'GET') {
        return;
    }
    event.respondWith(
        caches
            .match(event.request)
            .then(function (cached) {
                var networked = fetch(event.request)
                    .then(fetchedFromNetwork, unableToResolve)
                    .catch(unableToResolve);
                return cached || networked;

                function fetchedFromNetwork(response) {
                    var cacheCopy = response.clone();
                    caches
                        .open(version + '.pages')
                        .then(function add(cache) {
                            cache.put(event.request, cacheCopy);
                        });
                    return response;
                }

                function unableToResolve() {
                    return new Response('<h1>Service Unavailable (PWA Initialization Failed)</h1><h2>Relaunch this app again when active internet connection is available. </h2>', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    });
                }
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(function (keys) {
                return Promise.all(
                    keys
                        .filter(function (key) {
                            return !key.startsWith(version);
                        })
                        .map(function (key) {
                            return caches.delete(key);
                        })
                );
            })
    );
    return self.clients.claim();
});