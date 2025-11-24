// =================== 🌟 ELEMENT REFERENCES ===================
(() => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const toast = document.getElementById("toast");
  const themeToggle = document.getElementById("themeToggle");
  const emptyState = document.getElementById("emptyState");
  const fewTasksBanner = document.getElementById("fewTasksBanner");
  const quoteText = document.getElementById("quoteText");
  const colorThemeBtn = document.getElementById("colorThemeBtn");
  const colorWrapper = document.querySelector(".color-theme-wrapper");
  const fabColors = document.querySelectorAll(".fab-color");
  const appContainer = document.querySelector(".app-container");
  const offlineBanner = document.getElementById("offlineBanner");
  const closeBannerBtn = document.querySelector(".close-banner");

  let toastTimeout;
  let quoteInterval;
  let quoteIndex = 0;
  let offlineTimeout;
  let bannerDebounce;

  // =================== 🧩 GLOBAL VARIABLES ===================
  const ANIM_DURATION = 600;
  const motivationalQuotes = [
    "Start where you are. Use what you have. Do what you can.",
    "Small steps every day lead to big results.",
    "You don't need more time. You just need to decide.",
    "Progress, not perfection.",
    "One task at a time. You’ve got this!",
  ];

  // =================== 📦 STORAGE ===================
  const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
  const saveTasks = (tasks) =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

  // =================== 🖋️ TASKS ===================
  const renderTasks = (mode = "", editIndex = -1) => {
    taskList.innerHTML = "";
    const tasks = getTasks();

    // Sort tasks: pinned first
    const sortedTasks = tasks
      .map((task, index) => ({ ...task, originalIndex: index }))
      .sort((a, b) => b.isPinned - a.isPinned);

    sortedTasks.forEach((task, sortedIndex) => {
      const index = task.originalIndex;
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.originalIndex = index; // ⭐ important

      // Animation states
      if (mode === "add" && index === tasks.length - 1)
        li.classList.add("add-animate");
      else if (mode === "edit" && index === editIndex)
        li.classList.add("edit-animate");

      // Task number
      const numberSpan = document.createElement("span");
      numberSpan.className = "task-number";
      numberSpan.textContent = `${sortedIndex + 1}. `;
      li.appendChild(numberSpan);

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleComplete(index));
      li.appendChild(checkbox);

      // Task text
      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.completed) span.classList.add("completed");
      span.addEventListener("click", () => toggleComplete(index));
      li.appendChild(span);

      // Pin button
      const pinBtn = document.createElement("button");
      pinBtn.classList.add("pin-btn");
      if (task.isPinned) pinBtn.classList.add("pinned");
      pinBtn.innerHTML = `<i data-lucide="${
        task.isPinned ? "pin" : "pin-off"
      }"></i>`;
      pinBtn.title = task.isPinned ? "Unpin Task" : "Pin Task";
      pinBtn.setAttribute("aria-label", pinBtn.title);
      pinBtn.addEventListener("click", () => togglePin(index));
      li.appendChild(pinBtn);

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
      editBtn.title = "Edit Task";
      editBtn.setAttribute("aria-label", "Edit Task");
      editBtn.addEventListener("click", () =>
        editTask(index, span.textContent)
      );
      li.appendChild(editBtn);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
      deleteBtn.title = "Delete Task";
      deleteBtn.setAttribute("aria-label", "Delete Task");
      deleteBtn.addEventListener("click", () => deleteTask(index));
      li.appendChild(deleteBtn);

      // Append to list
      taskList.appendChild(li);
    });

    updateVisualStates();
    requestAnimationFrame(() => lucide.createIcons());

    // ⭐ Edit success flash (after render)
    if (mode === "edit" && editIndex !== -1) {
      const editedLi = [...taskList.children].find(
        (li) => Number(li.dataset.originalIndex) === editIndex
      );

      if (editedLi) {
        editedLi.classList.add("edit-saved");
        setTimeout(() => editedLi.classList.remove("edit-saved"), 700);
      }
    }
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;
    const tasks = getTasks();
    tasks.push({ text, completed: false, isPinned: false });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks("add");
    showToast("Task added!", "add");
    addBtn.disabled = true;
  };

  const toggleComplete = (index) => {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();

    // 🌈 Animate gradient strike-through after rendering
    const li = taskList.children[index];
    if (li) {
      const span = li.querySelector("span:not(.task-number)");
      if (span && tasks[index].completed) {
        span.classList.add("completed");
        setTimeout(() => span.classList.add("active"), 20);
      } else if (span) {
        span.classList.remove("active");
        setTimeout(() => span.classList.remove("completed"), 350);
      }
    }

    const msg = tasks[index].completed
      ? "Task marked as completed!"
      : "Task marked as incomplete!";
    showToast(msg, tasks[index].completed ? "complete" : "uncheck");
  };

  const togglePin = (index) => {
    // 1) READ BEFORE POSITIONS (old DOM)
    const beforeItems = [...taskList.children];
    const beforeRects = beforeItems.map((li) => li.getBoundingClientRect());

    // 2) UPDATE DATA
    const tasks = getTasks();
    tasks[index].isPinned = !tasks[index].isPinned;
    saveTasks(tasks);

    // 3) RE-RENDER (order changes here)
    renderTasks();

    // 4) READ AFTER POSITIONS (new DOM)
    const afterItems = [...taskList.children];
    const afterRects = afterItems.map((li) => li.getBoundingClientRect());

    // 5) FLIP ANIMATION
    afterItems.forEach((li, i) => {
      const before = beforeRects[i];
      const after = afterRects[i];
      if (!before || !after) return;

      const dx = before.left - after.left;
      const dy = before.top - after.top;

      // instantly place item at its previous spot
      li.style.transform = `translate(${dx}px, ${dy}px)`;
      li.style.transition = "transform 0ms";

      requestAnimationFrame(() => {
        li.style.transform = "";
        li.style.transition = "transform 450ms cubic-bezier(.2,.8,.2,1)";
      });

      li.addEventListener(
        "transitionend",
        () => {
          li.style.transition = "";
        },
        { once: true }
      );
    });

    // 6) PULSE EFFECT FOR THE PIN BUTTON
    const li = afterItems[index];
    const pinBtn = li?.querySelector(".pin-btn");
    if (pinBtn) {
      pinBtn.classList.add("pulse");
      setTimeout(() => pinBtn.classList.remove("pulse"), 380);
    }

    // 7) TOAST
    showToast(
      tasks[index].isPinned ? "Task pinned!" : "Task unpinned!",
      tasks[index].isPinned ? "pin" : "unpin"
    );
  };

  const deleteTask = (index) => {
    const li = taskList.children[index];
    if (li) {
      li.classList.add("delete-animate");
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      setTimeout(() => {
        renderTasks();
        showToast("Task deleted!", "delete");
      }, 600);
    }
  };

  const editTask = (index, oldText) => {
    const li = taskList.children[index];
    if (!li) return;
    const span = li.querySelector("span:not(.task-number)");
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.className = "edit-input";
    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      const newText = input.value.trim();
      if (!newText) {
        // 🟢 simplified check
        showToast("Task cannot be empty!", "error");
        renderTasks();
        return;
      }
      const tasks = getTasks();
      tasks[index].text = newText;
      saveTasks(tasks);
      renderTasks("edit", index);
      showToast("Task updated!", "edit");
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  };

  const clearAllTasks = () => {
    [...taskList.children].forEach((li) => {
      const randomX = Math.random() * 200 - 100;
      const randomY = Math.random() * 200 - 100;
      li.style.setProperty("--x", `${randomX}px`);
      li.style.setProperty("--y", `${randomY}px`);
      li.classList.add("clear-animate");
    });

    setTimeout(() => {
      localStorage.removeItem("tasks");
      renderTasks();
      showToast("All tasks cleared!", "clear");
    }, ANIM_DURATION);
  };

  // =================== 🔔 TOAST ===================
  const showToast = (msg, type = "") => {
    toast.textContent = msg;
    toast.className = `toast show${type ? ` toast-${type}` : ""}`;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => (toast.className = "toast"), 2000);
  };

  // =================== 🌓 THEME & COLOR ===================
  let selectedLightColor =
    localStorage.getItem("selectedLightColor") || "#f8c8dc";
  let selectedDarkColor =
    localStorage.getItem("selectedDarkColor") || "#9f5976";

  const applySavedColors = () => {
    const isDark = document.body.classList.contains("dark-mode");
    const color = isDark ? selectedDarkColor : selectedLightColor;
    appContainer.style.backgroundColor = color;
  };

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applySavedColors();
  };

  const applySavedTheme = () => {
    if (localStorage.getItem("theme") === "dark")
      document.body.classList.add("dark-mode");
  };

  colorThemeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    colorWrapper.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!colorWrapper.contains(e.target))
      colorWrapper.classList.remove("active");
  });

  function updateFabColorsForMode() {
    const isDark = document.body.classList.contains("dark-mode");
    const color = isDark
      ? localStorage.getItem("selectedDarkColor") || "#2e2a4a" // default dark
      : localStorage.getItem("selectedLightColor") || "#f8c8dc"; // default light
    appContainer.style.backgroundColor = color;
  }

  fabColors.forEach((c) => {
    c.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      const color = isDark ? c.dataset.dark : c.dataset.color;
      appContainer.style.backgroundColor = color;

      if (isDark) {
        selectedDarkColor = color;
        localStorage.setItem("selectedDarkColor", color);
      } else {
        selectedLightColor = color;
        localStorage.setItem("selectedLightColor", color);
      }

      fabColors.forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected");
      colorWrapper.classList.remove("active");
    });
  });

  // =================== ✨ QUOTES ===================
  const startQuoteRotation = () => {
    if (quoteInterval) clearInterval(quoteInterval);
    quoteText.textContent = motivationalQuotes[quoteIndex];
    quoteInterval = setInterval(() => {
      quoteText.classList.add("fade-out");
      setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
        quoteText.textContent = motivationalQuotes[quoteIndex];
        quoteText.classList.remove("fade-out");
      }, 500);
    }, 5000);
  };

  const stopQuoteRotation = () => {
    if (quoteInterval) clearInterval(quoteInterval);
  };

  // =================== 👁️ UI STATES ===================
  const updateVisualStates = () => {
    const count = taskList.children.length;
    if (count === 0) {
      emptyState.style.display = "block";
      fewTasksBanner.style.display = "none";
      taskList.style.display = "none";
      clearAllBtn.style.display = "none";
      stopQuoteRotation();
    } else if (count <= 3) {
      emptyState.style.display = "none";
      fewTasksBanner.style.display = "block";
      taskList.style.display = "block";
      clearAllBtn.style.display = "inline-block";
      startQuoteRotation();
    } else {
      emptyState.style.display = "none";
      fewTasksBanner.style.display = "none";
      taskList.style.display = "block";
      clearAllBtn.style.display = "inline-block";
      stopQuoteRotation();
    }
  };

  // =================== 🌐 OFFLINE ===================
  const updateNetworkBanner = () => {
    clearTimeout(bannerDebounce);
    bannerDebounce = setTimeout(() => {
      clearTimeout(offlineTimeout);
      if (!navigator.onLine) {
        offlineBanner.classList.remove("hidden");
        offlineTimeout = setTimeout(
          () => offlineBanner.classList.add("hidden"),
          10000
        );
      } else offlineBanner.classList.add("hidden");
    }, 300);
  };

  window.addEventListener("online", updateNetworkBanner);
  window.addEventListener("offline", updateNetworkBanner);
  closeBannerBtn?.addEventListener("click", () => {
    clearTimeout(offlineTimeout);
    offlineBanner.classList.add("hidden");
  });

  // =================== 🎛️ INPUT HANDLERS ===================
  taskInput.addEventListener(
    "input",
    () => (addBtn.disabled = taskInput.value.trim() === "")
  );
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && taskInput.value.trim() !== "") addTask();
  });

  addBtn.addEventListener("click", addTask);
  clearAllBtn.addEventListener("click", clearAllTasks);
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // 🔄 Instantly switch to correct color theme
    updateFabColorsForMode();
  });

  // =================== 🚀 INIT ===================
  applySavedTheme();
  applySavedColors();
  updateFabColorsForMode();
  addBtn.disabled = true;
  renderTasks();
  updateNetworkBanner();
  window.addEventListener("beforeunload", stopQuoteRotation);
})();
