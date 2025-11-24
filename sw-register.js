export function registerServiceWorker(showUpdateBanner) {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("./service-worker.js").then(reg => {
    if (reg.waiting) {
      showUpdateBanner();
      return;
    }

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      });
    });
  });
}
