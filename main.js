(() => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const emptyMessage = document.getElementById("emptyMessage");
  const toast = document.getElementById("toast");
  const themeToggle = document.getElementById("themeToggle");

  let toastTimeout;

  const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = (mode = "", editIndex = -1) => {
    const tasks = getTasks();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      emptyMessage.classList.add("show");
      clearAllBtn.style.display = "none";
    } else {
      emptyMessage.classList.remove("show");
      clearAllBtn.style.display = "inline-block";
    }

      // ✅ Step 1: Prepare a sorted version of tasks but keep track of original indices
      const sortedTasks = tasks
      .map((task, index) => ({ ...task, originalIndex: index })) // attach original index to each task
      .sort((a, b) => b.isPinned - a.isPinned); // sort by isPinned (true first)

      // ✅ Step 2: Loop through sorted tasks and create <li> elements for each
      sortedTasks.forEach((task, sortedIndex) => {
      const index = task.originalIndex; // ✅ Use original index to ensure correct reference in event listeners

      const li = document.createElement("li");
      li.className = "task-item";

      // ✨ Animation based on mode (add/edit)
      if (mode === "add" && index === tasks.length - 1) {
        li.classList.add("add-animate"); // animation for newly added task
      } else if (mode === "edit" && index === editIndex) {
        li.classList.add("edit-animate"); // animation for edited task
      }

      // ✅ Task number (sorted index + 1)
      const numberSpan = document.createElement("span");
      numberSpan.className = "task-number";
      numberSpan.textContent = `${sortedIndex + 1}. `;
      li.appendChild(numberSpan);

      // ✅ Checkbox for marking complete/incomplete
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleComplete(index)); // original index ensures correct task is toggled
      li.appendChild(checkbox);

      // ✅ Task text
      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.completed) {
        span.classList.add("completed"); // show strikethrough for completed tasks
      }
      span.addEventListener("click", () => toggleComplete(index)); // click toggles complete
      li.appendChild(span);

      // 📌 Pin/Unpin Button
      const pinBtn = document.createElement("button");
      pinBtn.classList.add("pin-btn");
      if (task.isPinned) pinBtn.classList.add("pinned");
      pinBtn.innerHTML = `<i data-lucide="${task.isPinned ? "pin" : "pin-off"}"></i>`; // show icon based on pin status
      pinBtn.title = task.isPinned ? "Unpin Task" : "Pin Task";
      pinBtn.setAttribute("aria-label", pinBtn.title); // accessibility
      pinBtn.setAttribute("aria-label", task.isPinned ? "Unpin task" : "Pin task");
      pinBtn.addEventListener("click", () => togglePin(index)); // use original index to toggle correct task
      li.appendChild(pinBtn);

      // ✏️ Edit Button
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
      editBtn.title = "Edit Task"; // ✅ tooltip
      editBtn.setAttribute("aria-label", "Edit Task"); // ✅ accessibility
      editBtn.addEventListener("click", () => editTask(index, span.textContent)); // use original index for editing
      li.appendChild(editBtn);

      // 🗑️ Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
      deleteBtn.title = "Delete Task"; // ✅ tooltip
      deleteBtn.setAttribute("aria-label", "Delete Task"); // ✅ accessibility
      deleteBtn.addEventListener("click", () => deleteTask(index)); // use original index for deletion
      li.appendChild(deleteBtn);

      // 📌 Append to the task list
      taskList.appendChild(li);
    });

    lucide.createIcons();
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

