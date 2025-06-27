(() => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const emptyMessage = document.getElementById("emptyMessage");
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

  const renderTasks = (mode = "", editIndex = -1) => {
    const taskListEl = document.getElementById("taskList");
    taskListEl.innerHTML = ""; // clear UI

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
      taskListEl.appendChild(li);
    });

    // ✅ Update the visual state (empty image, banner, etc.)
    updateVisualStates();

    // ✅ Refresh icons
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

      // Wait for fade-out to finish before changing text
      setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
        quoteText.textContent = motivationalQuotes[quoteIndex];

        // Fade in the new quote
        quoteText.classList.remove("fade-out");
      }, 500); // match transition duration
    }, 5000);// change quote every 5 seconds
  };

  const stopQuoteRotation = () => {
    if (quoteInterval) {
      clearInterval(quoteInterval);
      quoteInterval = null;
    }
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    const tasks = getTasks();
    tasks.push({ text, completed: false, isPinned: false });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks("add"); // Trigger add animation
    showToast("Task added!", "add");
    addBtn.disabled = true;
  };

  const toggleComplete = (index) => {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();

    // ✅ Show toast based on completed or uncompleted
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

    showToast(
      isNowPinned ? "Task pinned!" : "Task unpinned!",
      isNowPinned ? "pin" : "unpin"
    );
  };

  const deleteTask = (index) => {
    const li = taskList.children[index];
    if (li) {
      li.classList.add("delete-animate");

      // ✅ Immediately update localStorage
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);

      // ✅ Wait for animation to complete before re-rendering
      setTimeout(() => {
        renderTasks();
        showToast("Task deleted!", "delete");
      }, 600); // Match CSS animation duration
    }
  };

  const editTask = (index, oldText) => {
    const li = taskList.children[index];
    const span = li.querySelector("span:not(.task-number)");

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.className = "edit-input";
    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      const newText = input.value.trim();
      if (newText === "") {
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
    const listItems = [...taskList.children];
    listItems.forEach((li, i) => {
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
    }, 600);
  };

  const showToast = (msg, type = "") => {
    toast.textContent = msg; // Just plain text
    toast.className = "toast show"; // Reset classes and add "show"

    if (type) {
      toast.classList.add(`toast-${type}`); // Optional colored styles
    }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
      if (type) toast.classList.remove(`toast-${type}`);
    }, 2000);
  };

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  };

  const applySavedTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
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
})();
