const CACHE_NAME = "todo-app-v3"; // bump version to force fresh cache

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./main.js",
  "./dom.js",
  "./todo.js",
  "./manifest.json",
  "./favicon.ico",

  // assets 
  "./assets/no-tasks.svg",
  "./assets/Todo-app-Demo.gif",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-icon-512.png"
];

// Install SW and cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Serve from cache → fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(a => a || fetch(event.request))
  );
});

// Clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});
