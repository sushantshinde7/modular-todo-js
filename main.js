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

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // ✨ Animation classes
    if (mode === "add" && index === tasks.length - 1) {
      li.classList.add("add-animate");
    } else if (mode === "edit" && index === editIndex) {
      li.classList.add("edit-animate");
    }

    // ✅ Numbering
    const numberSpan = document.createElement("span");
    numberSpan.className = "task-number";
    numberSpan.textContent = `${index + 1}. `;
    li.appendChild(numberSpan);

    // ✅ Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));
    li.appendChild(checkbox);

    // ✅ Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add("completed");
    }
    span.addEventListener("click", () => toggleComplete(index));
    li.appendChild(span);

    // ✅ Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
    editBtn.addEventListener("click", () => editTask(index, span.textContent));
    li.appendChild(editBtn);

    // ✅ Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.addEventListener("click", () => deleteTask(index));
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  lucide.createIcons();
};

  
const addTask = () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  const tasks = getTasks();
  tasks.push({ text, completed: false });
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
    const tasks = getTasks();
    tasks[index].text = newText || oldText;
    saveTasks(tasks);
    renderTasks("edit", index); // Trigger edit animation
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
    showToast("All tasks cleared!");
  }, 600);
};

const showToast = (msg, type = "") => {
  toast.textContent = msg;

  toast.className = "toast";
  toast.classList.add("show");

  if (type) {
    toast.classList.add(`toast-${type}`);
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    if (type) toast.classList.remove(`toast-${type}`);
  }, 2000);
};

    const toggleTheme = () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
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
  






