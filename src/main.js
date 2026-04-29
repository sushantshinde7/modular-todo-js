import { registerServiceWorker } from "../sw-register.js";
import {
  ANIM_DURATION,
  motivationalQuotes,
  placeholderTexts,
} from "./config/constants.js";

import { getTasks } from "./tasks/taskStore.js";

import {
  stopQuoteRotation,
  updateEmptyStateUI,
} from "./ui/feedbackUI.js";

import { renderTasks } from "./tasks/taskUI.js";

import {
  addTask,
  toggleComplete,
  togglePin,
  deleteTask,
  editTask,
  clearAllTasks,
} from "./tasks/taskManager.js";

import { initThemeManager } from "./ui/themeManager.js";

import {
  initOfflineBanner,
  showUpdateAvailableBanner,
} from "./ui/bannerUI.js";

// =================== APP BOOTSTRAP ===================
(() => {
  // =================== ELEMENT REFERENCES ===================
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const toast = document.getElementById("toast");

  const themeToggle = document.getElementById("themeToggle");
  const colorThemeBtn = document.getElementById("colorThemeBtn");
  const colorWrapper = document.querySelector(".color-theme-wrapper");
  const fabColors = document.querySelectorAll(".fab-color");
  const appContainer = document.querySelector(".app-container");

  const emptyState = document.getElementById("emptyState");
  const fewTasksBanner = document.getElementById("fewTasksBanner");
  const quoteText = document.getElementById("quoteText");

  const offlineBanner = document.getElementById("offlineBanner");
  const closeBannerBtn = document.querySelector(".close-banner");

  let currentFilter = "all";

  taskInput.focus();

  // =================== PLACEHOLDER ROTATION ===================
  let placeholderIndex = 0;

  function rotatePlaceholder() {
    taskInput.classList.add("placeholder-hide");

    setTimeout(() => {
      taskInput.placeholder = placeholderTexts[placeholderIndex];
      placeholderIndex =
        (placeholderIndex + 1) % placeholderTexts.length;

      taskInput.classList.remove("placeholder-hide");
    }, 250);
  }

  setInterval(rotatePlaceholder, 3000);
  rotatePlaceholder();

  // =================== SHARED RENDER CONFIG ===================
  const getRenderConfig = () => ({
    taskList,
    clearAllBtn,
    emptyState,
    fewTasksBanner,
    quoteText,
    motivationalQuotes,
    currentFilter,
    getTasksFn: getTasks,

    toggleComplete: (index) =>
      toggleComplete({
        index,
        taskList,
        toast,
        renderContext: getRenderConfig(),
      }),

    togglePin: (index) =>
      togglePin({
        index,
        taskList,
        toast,
        renderContext: getRenderConfig(),
      }),

    editTask: (index, oldText) =>
      editTask({
        index,
        oldText,
        taskList,
        toast,
        renderContext: getRenderConfig(),
      }),

    deleteTask: (index) =>
      deleteTask({
        index,
        taskList,
        toast,
        renderContext: getRenderConfig(),
      }),
  });

  // =================== SHARED HANDLER CONTEXT ===================
  const getHandlerContext = () => ({
    taskInput,
    addBtn,
    taskList,
    toast,
    renderContext: getRenderConfig(),
    animDuration: ANIM_DURATION,
  });

  // =================== THEME INIT ===================
  initThemeManager({
    themeToggle,
    colorThemeBtn,
    colorWrapper,
    fabColors,
    appContainer,
    updateEmptyStateUI,
    getTasks,
    getCurrentFilter: () => currentFilter,
  });

  // =================== BANNER INIT ===================
  initOfflineBanner({
    offlineBanner,
    closeBannerBtn,
  });

  // =================== INPUT HANDLERS ===================
  taskInput.addEventListener("input", () => {
    addBtn.disabled = taskInput.value.trim() === "";
  });

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && taskInput.value.trim()) {
      addTask(getHandlerContext());
    }
  });

  addBtn.addEventListener("click", () => {
    addTask(getHandlerContext());
  });

  clearAllBtn.addEventListener("click", () => {
    clearAllTasks(getHandlerContext());
  });

  // =================== FILTER HANDLERS ===================
  document.querySelectorAll(".task-filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;

      document
        .querySelectorAll(".task-filters button")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      renderTasks(getRenderConfig());

      updateEmptyStateUI(currentFilter, getTasks);
    });
  });

  // =================== SERVICE WORKER ===================
  registerServiceWorker(showUpdateAvailableBanner);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage("skipWaiting");
    });
  }

  // =================== INITIAL RENDER ===================
  addBtn.disabled = true;

  renderTasks(getRenderConfig());

  window.addEventListener("beforeunload", stopQuoteRotation);
})();
