/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/details.css",
    "revision": "e711588656eb2771f95e7949d7c7cade"
  },
  {
    "url": "css/normalize.css",
    "revision": "918bae3dde1f011116932555477e1ed2"
  },
  {
    "url": "css/styles.css",
    "revision": "e63af0c11ca67408a660146ee55d32ff"
  },
  {
    "url": "css/toastr.min.css",
    "revision": "832a211df71951ce2f9966a875046abc"
  },
  {
    "url": "img/1-320_small.jpg",
    "revision": "4e78569905c56574a353b00bc063fe09"
  },
  {
    "url": "img/1-320_small.webp",
    "revision": "9dfff4018cd5307931dc23fe448e676f"
  },
  {
    "url": "img/1-640_medium.jpg",
    "revision": "1514b056dd2d6f9b59866a788e0b1407"
  },
  {
    "url": "img/1-640_medium.webp",
    "revision": "8f65af1583379faf0b4557c96f3a3301"
  },
  {
    "url": "img/1-800_large.jpg",
    "revision": "c5aecae82dc541afbb1ee3768f5fb978"
  },
  {
    "url": "img/1-800_large.webp",
    "revision": "f274fdead001baaa262f06e61746af9a"
  },
  {
    "url": "img/10-320_small.jpg",
    "revision": "f4af8084a051f55e0d7b9aa4eef0a051"
  },
  {
    "url": "img/10-320_small.webp",
    "revision": "16888043760c709c28171d905cc2b033"
  },
  {
    "url": "img/10-640_medium.jpg",
    "revision": "f0c833358b4d0b2b4b2e07d422220969"
  },
  {
    "url": "img/10-640_medium.webp",
    "revision": "6a2ef0d928c235997afb89bdf3033137"
  },
  {
    "url": "img/10-800_large.jpg",
    "revision": "56119306652cb05ea8e23c728de171a2"
  },
  {
    "url": "img/10-800_large.webp",
    "revision": "cf6d6821311285c3788b62bd058d0732"
  },
  {
    "url": "img/2-320_small.jpg",
    "revision": "caafcf6a968820f0e3a6524b13153696"
  },
  {
    "url": "img/2-320_small.webp",
    "revision": "42a3d580f37e6e53de3b33b22b084878"
  },
  {
    "url": "img/2-640_medium.jpg",
    "revision": "5cc7b78dc697eeda9d3721ed3a48c0ea"
  },
  {
    "url": "img/2-640_medium.webp",
    "revision": "94fe06c40c778eb203bff207c061d5b6"
  },
  {
    "url": "img/2-800_large.jpg",
    "revision": "8e489145452ec3f10e679538a9fe6021"
  },
  {
    "url": "img/2-800_large.webp",
    "revision": "347697027d025c1137e405fcf7c70cb8"
  },
  {
    "url": "img/3-320_small.jpg",
    "revision": "c299573ecfc1f105dfadd4b6c0f8a0e1"
  },
  {
    "url": "img/3-320_small.webp",
    "revision": "118baef2e4b6b50e915a71da0172b508"
  },
  {
    "url": "img/3-640_medium.jpg",
    "revision": "9367f13d2730a7f232871da87cfa11f9"
  },
  {
    "url": "img/3-640_medium.webp",
    "revision": "a299341adcce31cc6339410b26ca9662"
  },
  {
    "url": "img/3-800_large.jpg",
    "revision": "b82c0bd91e3cb927da72ff417824e683"
  },
  {
    "url": "img/3-800_large.webp",
    "revision": "e3d0b60cd776135e7b68b31ee68ba988"
  },
  {
    "url": "img/4-320_small.jpg",
    "revision": "79ab059c4e7fbf4472787ae757813d4b"
  },
  {
    "url": "img/4-320_small.webp",
    "revision": "8d3a02b789f82540f1289fbc34b2e060"
  },
  {
    "url": "img/4-640_medium.jpg",
    "revision": "b00363c07093015f5abbb66d1aa2fdb3"
  },
  {
    "url": "img/4-640_medium.webp",
    "revision": "09c16dbf042ffd7f0535737ad4202a99"
  },
  {
    "url": "img/4-800_large.jpg",
    "revision": "91f84c4ee559fede8a90630d86925974"
  },
  {
    "url": "img/4-800_large.webp",
    "revision": "dd50157f48db452ddbebdd60a0edcc06"
  },
  {
    "url": "img/5-320_small.jpg",
    "revision": "8d2216f4ca094975a2a75db513e224a7"
  },
  {
    "url": "img/5-320_small.webp",
    "revision": "2e44d9bf709c48abe8a3712b2a3f687c"
  },
  {
    "url": "img/5-640_medium.jpg",
    "revision": "d7889f0736324c447a2c8c6792459b5c"
  },
  {
    "url": "img/5-640_medium.webp",
    "revision": "f1987f22e957d1f340cda366a2f08114"
  },
  {
    "url": "img/5-800_large.jpg",
    "revision": "145102c6a66062c17e7181a1a623d7fe"
  },
  {
    "url": "img/5-800_large.webp",
    "revision": "4b5254bebf8073564938d15c35ed0294"
  },
  {
    "url": "img/6-320_small.jpg",
    "revision": "64ca1177c470b374e4ae5fddde5c842c"
  },
  {
    "url": "img/6-320_small.webp",
    "revision": "b9eac3f8c480a44e58266693138fa985"
  },
  {
    "url": "img/6-640_medium.jpg",
    "revision": "e77522182715beba7e6b2914c9fa48dd"
  },
  {
    "url": "img/6-640_medium.webp",
    "revision": "1dce0f01342ad01efa67721575afa4ee"
  },
  {
    "url": "img/6-800_large.jpg",
    "revision": "9e62c748d9d51bbfaee7adc139e1af2f"
  },
  {
    "url": "img/6-800_large.webp",
    "revision": "ef8f8ebc1faaae4d67ec716ed7247100"
  },
  {
    "url": "img/7-320_small.jpg",
    "revision": "6ed5742640e04527afe11cc3424beab0"
  },
  {
    "url": "img/7-320_small.webp",
    "revision": "11c7b5970f4ac57411c1de6ebad402a3"
  },
  {
    "url": "img/7-640_medium.jpg",
    "revision": "e3efa6419a6797267eff4f06c2aebe57"
  },
  {
    "url": "img/7-640_medium.webp",
    "revision": "cff0c26008ddf9ff7ea4e5e22f89b3d2"
  },
  {
    "url": "img/7-800_large.jpg",
    "revision": "de082c05dde73ae8363dcfe636b479d0"
  },
  {
    "url": "img/7-800_large.webp",
    "revision": "c86247364323f1438eda839ca2a2cc38"
  },
  {
    "url": "img/8-320_small.jpg",
    "revision": "f65bb3a8dd95e67ca3f5d2f5a2e198c3"
  },
  {
    "url": "img/8-320_small.webp",
    "revision": "2554cd4dc3ab5fe0d872491910d577f1"
  },
  {
    "url": "img/8-640_medium.jpg",
    "revision": "e3f49a951196754d5827b3441c62baa7"
  },
  {
    "url": "img/8-640_medium.webp",
    "revision": "7854090fd7e39cefed871453266bfc6c"
  },
  {
    "url": "img/8-800_large.jpg",
    "revision": "001c09e386e755f4db1aae5085e321bb"
  },
  {
    "url": "img/8-800_large.webp",
    "revision": "ceae0eb5b3c3b531afcb617cb38dee1e"
  },
  {
    "url": "img/9-320_small.jpg",
    "revision": "91250f86392242714a859a9d93ff93ab"
  },
  {
    "url": "img/9-320_small.webp",
    "revision": "397a9f5f134a9cf21411ad7b83ceb1f9"
  },
  {
    "url": "img/9-640_medium.jpg",
    "revision": "5d061306e8ad23d59076295bf0be8430"
  },
  {
    "url": "img/9-640_medium.webp",
    "revision": "d36f9b0091385da9e6835aae5deaed17"
  },
  {
    "url": "img/9-800_large.jpg",
    "revision": "c078020b64da95b360e6ff3aa1b39c1c"
  },
  {
    "url": "img/9-800_large.webp",
    "revision": "26df4487e1a4fbe3bb380fcf46e51854"
  },
  {
    "url": "index.html",
    "revision": "c329d0243aba0f12b87f60029b997442"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "611ae40078dce35b05abae64d951e4b8"
  },
  {
    "url": "js/main.js",
    "revision": "a1b39f103abce4211b708a84f5183bea"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "bc9fcebda0e4fec3e7bd0186eda691ae"
  },
  {
    "url": "libs/vender.js",
    "revision": "88ae80318659221e372dd0d1da3ecf9a"
  },
  {
    "url": "offline.html",
    "revision": "3b73101cdc9f3f18df559b54e7f3bdcd"
  },
  {
    "url": "restaurant.html",
    "revision": "82a1c54b34c112894769042f9fe2651f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
