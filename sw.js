var cacheName = 'ProgramMatch v1.1';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',

  '/classes/draw3.js',
  '/classes/settings.js',





  '/assets/sprites/arrows.png',
  '/assets/sprites/badge.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/bug.png',
  '/assets/sprites/burst.png',
  '/assets/sprites/gem.png',
  '/assets/sprites/menu.png',
  '/assets/sprites/player.png',
  '/assets/sprites/productivity.png',
  '/assets/sprites/virus.png',


  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});