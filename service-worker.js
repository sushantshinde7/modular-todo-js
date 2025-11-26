const CACHE_NAME = "todo-app-v4"; // bump version to force fresh cache

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
  "./assets/no-tasks-dark.svg",
  "./assets/no-tasks-light.svg",
  "./assets/no-completed-dark.svg",
  "./assets/no-completed-light.svg",
  "./assets/no-pinned-dark.svg",
  "./assets/no-pinned-light.svg",
  "./assets/no-pending-dark.svg",
  "./assets/no-pending-light.svg",
  "./assets/Todo-app-Demo.gif",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-icon-512.png"
];


// Install SW and cache everything
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate → clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch → network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() =>
        caches.match(request).then((cachedResponse) => cachedResponse)
      )
  );
});
// Optional: immediately activate new SW when sent a message
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
