importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp('/img/'),
    workbox.strategies.cacheFirst()
);


workbox.routing.registerRoute(
    new RegExp('/restaurant.html'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/restaurants'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/restaurants/(\d+)'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/reviews/?restaurant_id=[0-9]+'),
    workbox.strategies.staleWhileRevalidate()
);

const bgSyncPlugin = new workbox.backgroundSync.Plugin('reviewQuery', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
    /\/reviews/,
    workbox.strategies.networkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);