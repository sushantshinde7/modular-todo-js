export function initOfflineBanner({
  offlineBanner,
  closeBannerBtn,
}) {
  let offlineTimeout;
  let bannerDebounce;

  const updateNetworkBanner = () => {
    clearTimeout(bannerDebounce);

    bannerDebounce = setTimeout(() => {
      clearTimeout(offlineTimeout);

      if (!navigator.onLine) {
        offlineBanner.classList.remove("hidden");

        offlineTimeout = setTimeout(() => {
          offlineBanner.classList.add("hidden");
        }, 10000);
      } else {
        offlineBanner.classList.add("hidden");
      }
    }, 300);
  };

  window.addEventListener("online", updateNetworkBanner);
  window.addEventListener("offline", updateNetworkBanner);

  closeBannerBtn?.addEventListener("click", () => {
    clearTimeout(offlineTimeout);
    offlineBanner.classList.add("hidden");
  });

  updateNetworkBanner();
}

export function showUpdateAvailableBanner() {
  if (document.querySelector(".update-banner")) return;

  const banner = document.createElement("div");

  banner.className = "update-banner";
  banner.textContent =
    "🔄 New update available — Tap to refresh";

  banner.addEventListener("click", () => {
    window.location.reload();
  });

  document.body.appendChild(banner);
}