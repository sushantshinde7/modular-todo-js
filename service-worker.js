const CACHE_NAME = "todo-app-v5";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",

  "./styles/styles.css",

  // Source Files
  "./src/main.js",
  "./src/config/constants.js",

  "./src/tasks/taskStore.js",
  "./src/tasks/taskManager.js",
  "./src/tasks/taskUI.js",

  "./src/ui/themeManager.js",
  "./src/ui/feedbackUI.js",
  "./src/ui/bannerUI.js",

  // Assets
  "./assets/no-task-dark.svg",
  "./assets/no-task-light.svg",
  "./assets/no-tasks.svg",

  "./assets/no-completed-dark.svg",
  "./assets/no-completed-light.svg",

  "./assets/no-pinned-dark.svg",
  "./assets/no-pinned-light.svg",

  "./assets/no-pending-dark.svg",
  "./assets/no-pending-light.svg",

  "./assets/Todo-app-Demo.gif",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-icon-512.png",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });

        return response;
      })
      .catch(() => caches.match(request))
  );
});

// MANUAL SKIP WAITING
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});