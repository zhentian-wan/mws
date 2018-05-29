importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'pwa-cache-google-fonts',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
            }),
        ],
    }),
);

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
    workbox.strategies.cacheFirst({
        cacheName: 'my-restaurants-cache'
    })
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/restaurants/(\d+)'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/reviews'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'my-reviews-cache'
    })
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

const restBgSyncPlugin = new workbox.backgroundSync.Plugin('restaurantQuery', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
    /\/restaurants\/[0-9]+\/?is_favorite/,
    workbox.strategies.networkOnly({
        plugins: [restBgSyncPlugin]
    }),
    'PUT'
);