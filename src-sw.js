importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

console.log('this is my custom service worker');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/(restaurants|reviews)'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:1337/(restaurants|reviews)/(\d+)'),
    workbox.strategies.cacheFirst()
  );