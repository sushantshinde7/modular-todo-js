export function initThemeManager({
  themeToggle,
  colorThemeBtn,
  colorWrapper,
  fabColors,
  appContainer,
  updateEmptyStateUI,
  getTasks,
  getCurrentFilter,
}) {
  let selectedLightColor =
    localStorage.getItem("selectedLightColor") || "#f8c8dc";

  let selectedDarkColor =
    localStorage.getItem("selectedDarkColor") || "#9f5976";

  const applySavedTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  };

  const applySavedColors = () => {
    const isDark = document.body.classList.contains("dark-mode");

    appContainer.style.backgroundColor = isDark
      ? selectedDarkColor
      : selectedLightColor;
  };

  const syncSelectedFabState = () => {
    const isDark = document.body.classList.contains("dark-mode");

    const activeColor = isDark
      ? selectedDarkColor
      : selectedLightColor;

    fabColors.forEach((fab) => {
      const fabColor = isDark
        ? fab.dataset.dark
        : fab.dataset.color;

      fab.classList.toggle("selected", fabColor === activeColor);
    });
  };

  const updateFabColorsForMode = () => {
    applySavedColors();
    syncSelectedFabState();
  };

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateFabColorsForMode();
    updateEmptyStateUI(getCurrentFilter(), getTasks);
  });

  colorThemeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    colorWrapper.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!colorWrapper.contains(e.target)) {
      colorWrapper.classList.remove("active");
    }
  });

  fabColors.forEach((c) => {
    c.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");

      const color = isDark
        ? c.dataset.dark
        : c.dataset.color;

      appContainer.style.backgroundColor = color;

      if (isDark) {
        selectedDarkColor = color;
        localStorage.setItem("selectedDarkColor", color);
      } else {
        selectedLightColor = color;
        localStorage.setItem("selectedLightColor", color);
      }

      syncSelectedFabState();
      colorWrapper.classList.remove("active");
    });
  });

  const tipEl = document.createElement("div");
  tipEl.className = "custom-tip";
  document.body.appendChild(tipEl);

  const showTip = (text, x, y) => {
    tipEl.textContent = text;
    tipEl.style.left = `${x}px`;
    tipEl.style.top = `${y}px`;
    tipEl.style.opacity = 1;
    tipEl.style.transform = "translateY(0)";
  };

  const hideTip = () => {
    tipEl.style.opacity = 0;
    tipEl.style.transform = "translateY(4px)";
  };

  fabColors.forEach((fab) => {
    fab.addEventListener("mouseenter", () => {
      const isDark = document.body.classList.contains("dark-mode");

      const name = isDark
        ? fab.dataset.nameDark
        : fab.dataset.nameLight;

      const rect = fab.getBoundingClientRect();

      showTip(
        name,
        rect.left + rect.width / 2 - tipEl.offsetWidth / 2,
        rect.top - 32
      );
    });

    fab.addEventListener("mousemove", () => {
      const rect = fab.getBoundingClientRect();

      tipEl.style.left =
        rect.left + rect.width / 2 - tipEl.offsetWidth / 2 + "px";

      tipEl.style.top = rect.top - 32 + "px";
    });

    fab.addEventListener("mouseleave", hideTip);
  });

  applySavedTheme();
  applySavedColors();
  syncSelectedFabState();
}