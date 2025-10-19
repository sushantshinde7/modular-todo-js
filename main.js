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

  let toastTimeout;

  const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // 🟢 Removed redundant querySelector for taskListEl
  // Previously: const taskListEl = document.getElementById("taskList");
  const renderTasks = (mode = "", editIndex = -1) => {
    taskList.innerHTML = ""; // clear UI (directly using stored reference)

    const tasks = getTasks();

    // Sort tasks: pinned first
    const sortedTasks = tasks
      .map((task, index) => ({ ...task, originalIndex: index }))
      .sort((a, b) => b.isPinned - a.isPinned);

    sortedTasks.forEach((task, sortedIndex) => {
      const index = task.originalIndex;

      const li = document.createElement("li");
      li.className = "task-item";

      // Animation classes
      if (mode === "add" && index === tasks.length - 1) {
        li.classList.add("add-animate");
      } else if (mode === "edit" && index === editIndex) {
        li.classList.add("edit-animate");
      }

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
      if (task.completed) {
        span.classList.add("completed");
      }
      span.addEventListener("click", () => toggleComplete(index));
      li.appendChild(span);

      // Pin button
      const pinBtn = document.createElement("button");
      pinBtn.classList.add("pin-btn");
      if (task.isPinned) pinBtn.classList.add("pinned");
      pinBtn.innerHTML = `<i data-lucide="${task.isPinned ? "pin" : "pin-off"}"></i>`;
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
      editBtn.addEventListener("click", () => editTask(index, span.textContent));
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
    lucide.createIcons();
  };

  const updateVisualStates = () => {
    const taskCount = taskList.children.length;

    if (taskCount === 0) {
      emptyState.style.display = "block";
      fewTasksBanner.style.display = "none";
      stopQuoteRotation();
      taskList.style.display = "none";
      clearAllBtn.style.display = "none";
    } else if (taskCount > 0 && taskCount <= 3) {
      emptyState.style.display = "none";
      fewTasksBanner.style.display = "block";
      startQuoteRotation();
      taskList.style.display = "block";
      clearAllBtn.style.display = "inline-block";
    } else {
      emptyState.style.display = "none";
      fewTasksBanner.style.display = "none";
      stopQuoteRotation();
      taskList.style.display = "block";
      clearAllBtn.style.display = "inline-block";
    }
  };

  const motivationalQuotes = [
    "Start where you are. Use what you have. Do what you can.",
    "Small steps every day lead to big results.",
    "You don't need more time. You just need to decide.",
    "Progress, not perfection.",
    "One task at a time. You’ve got this!",
  ];

  let quoteIndex = 0;
  let quoteInterval;

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
    if (quoteInterval) {
      clearInterval(quoteInterval);
      quoteInterval = null;
    }
  };

  // 🟢 Small improvement: simpler truthy check for empty input
  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return; // was: if (text === "") return;

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
  const type = tasks[index].completed ? "complete" : "uncheck";
  showToast(msg, type);
};


  const togglePin = (index) => {
    const tasks = getTasks();
    const isNowPinned = !tasks[index].isPinned;
    tasks[index].isPinned = isNowPinned;
    saveTasks(tasks);
    renderTasks();
    showToast(isNowPinned ? "Task pinned!" : "Task unpinned!", isNowPinned ? "pin" : "unpin");
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
    if (!li) return; // 🟢 Added guard to avoid errors if element missing
    const span = li.querySelector("span:not(.task-number)");

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.className = "edit-input";
    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      const newText = input.value.trim();
      if (!newText) { // 🟢 simplified check
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

  const ANIM_DURATION = 600; // 🟢 Added constant for animation duration

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
    }, ANIM_DURATION); // 🟢 uses the new constant
  };

  // 🟢 Simplified toast reset (cleans all classes at once)
  const showToast = (msg, type = "") => {
    toast.textContent = msg;
    toast.className = `toast show${type ? ` toast-${type}` : ""}`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.className = "toast"; // reset entirely
    }, 2000);
  };

  // 🟢 Simplified theme logic with direct toggle value
  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const applySavedTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  };

  taskInput.addEventListener("input", () => {
    addBtn.disabled = taskInput.value.trim() === "";
  });

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && taskInput.value.trim() !== "") {
      addTask();
    }
  });

  addBtn.addEventListener("click", addTask);
  clearAllBtn.addEventListener("click", clearAllTasks);
  themeToggle.addEventListener("click", toggleTheme);

  applySavedTheme();
  addBtn.disabled = true;
  renderTasks();

  // === Offline Banner Logic ===
  const offlineBanner = document.getElementById("offlineBanner");
  const closeBannerBtn = document.querySelector(".close-banner");
  let offlineTimeout;

  const updateNetworkBanner = () => {
    clearTimeout(offlineTimeout);

    if (!navigator.onLine) {
      offlineBanner.classList.remove("hidden");
      offlineTimeout = setTimeout(() => {
        offlineBanner.classList.add("hidden");
      }, 10000);
    } else {
      offlineBanner.classList.add("hidden");
    }
  };

  window.addEventListener("online", updateNetworkBanner);
  window.addEventListener("offline", updateNetworkBanner);

  closeBannerBtn?.addEventListener("click", () => {
    clearTimeout(offlineTimeout);
    offlineBanner.classList.add("hidden");
  });

  updateNetworkBanner();

  // 🟢 Added cleanup for interval leaks
  window.addEventListener("beforeunload", stopQuoteRotation);

})();
