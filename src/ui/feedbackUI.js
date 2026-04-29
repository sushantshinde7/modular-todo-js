let toastTimeout;
let quoteInterval;
let quoteIndex = 0;

export const showToast = (toast, msg, type = "") => {
  toast.textContent = msg;
  toast.className = `toast show${type ? ` toast-${type}` : ""}`;

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.className = "toast";
  }, 2000);
};

export const startQuoteRotation = (
  quoteText,
  motivationalQuotes
) => {
  clearInterval(quoteInterval);

  quoteText.textContent = motivationalQuotes[quoteIndex];

  quoteInterval = setInterval(() => {
    quoteText.classList.add("fade-out");

    setTimeout(() => {
      quoteIndex =
        (quoteIndex + 1) % motivationalQuotes.length;

      quoteText.textContent =
        motivationalQuotes[quoteIndex];

      quoteText.classList.remove("fade-out");
    }, 500);
  }, 5000);
};

export const stopQuoteRotation = () => {
  clearInterval(quoteInterval);
  quoteInterval = null;
};

export function updateEmptyStateUI(currentFilter, getTasksFn) {
  const imgEl = document.getElementById("emptyStateImg");
  const textEl = document.getElementById("emptyStateText");

  if (!imgEl || !textEl) return;

  const isDark =
    document.body.classList.contains("dark-mode");

  let img = "assets/no-tasks.svg";
  let showText = true;

  const textHTML = `
    <strong>Clean slate!</strong>
    Start by adding your
    <span class="keyword">first task</span>.
  `;

  if (currentFilter === "completed") {
    img = isDark
      ? "assets/no-completed-dark.svg"
      : "assets/no-completed-light.svg";

    showText = false;
  } else if (currentFilter === "pinned") {
    img = isDark
      ? "assets/no-pinned-dark.svg"
      : "assets/no-pinned-light.svg";

    showText = false;
  } else if (
    currentFilter === "all" &&
    getTasksFn().length === 0
  ) {
    img = isDark
      ? "assets/no-task-dark.svg"
      : "assets/no-task-light.svg";

    showText = false;
  } else if (currentFilter === "pending") {
    const pendingTasks = getTasksFn().filter(
      (t) => !t.completed
    );

    if (pendingTasks.length === 0) {
      img = isDark
        ? "assets/no-pending-dark.svg"
        : "assets/no-pending-light.svg";

      showText = false;
    }
  }

  imgEl.src = img;

  textEl.style.display = showText ? "block" : "none";

  if (showText) {
    textEl.innerHTML = textHTML;
  }
}

export function updateVisualStates({
  taskList,
  emptyState,
  fewTasksBanner,
  clearAllBtn,
  currentFilter,
  getTasksFn,
  startQuoteRotationFn,
  stopQuoteRotationFn,
  quoteText,
  motivationalQuotes,
}) {
  const count = taskList.children.length;

  if (count === 0) {
    emptyState.style.display = "block";
    fewTasksBanner.style.display = "none";
    taskList.style.display = "none";
    clearAllBtn.style.display = "none";

    updateEmptyStateUI(currentFilter, getTasksFn);

    stopQuoteRotationFn();
    return;
  }

  emptyState.style.display = "none";
  taskList.style.display = "block";
  clearAllBtn.style.display = "inline-block";

  if (count <= 3) {
    fewTasksBanner.style.display = "block";

    startQuoteRotationFn(
      quoteText,
      motivationalQuotes
    );
  } else {
    fewTasksBanner.style.display = "none";

    stopQuoteRotationFn();
  }
}