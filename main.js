(() => {
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const emptyMessage = document.getElementById("emptyMessage");
    const toast = document.getElementById("toast");
    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sun");
    const moonIcon = document.getElementById("moon");
  
    let toastTimeout;
  
    const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
  
    const saveTasks = (tasks) => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
  
    const renderTasks = () => {
      const tasks = getTasks();
      taskList.innerHTML = "";
  
      if (tasks.length === 0) {
        emptyMessage.classList.add("show");
      } else {
        emptyMessage.classList.remove("show");
      }
  
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
  
        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) {
          span.classList.add("completed");
        }
  
        span.addEventListener("click", () => toggleComplete(index));
  
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
        editBtn.addEventListener("click", () => editTask(index, span.textContent));
  
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
        deleteBtn.addEventListener("click", () => deleteTask(index));
  
        li.appendChild(span);
        li.appendChild(editBtn);
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
      renderTasks();
      addBtn.disabled = true;
    };
  
    const toggleComplete = (index) => {
      const tasks = getTasks();
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    };
  
    const deleteTask = (index) => {
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    };
  
    const editTask = (index, oldText) => {
      const li = taskList.children[index];
      const span = li.querySelector("span");
  
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
        renderTasks();
      });
  
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    };
  
    const clearAllTasks = () => {
      localStorage.removeItem("tasks");
      renderTasks();
      showToast("All tasks cleared!");
    };
  
    const showToast = (msg) => {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    };
  
    // ✅ New: Theme toggle logic
    const toggleTheme = () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    };
  
    // ✅ On load: apply saved theme
    const applySavedTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      }
    };
  
    // ✅ Feature: Enable/disable Add button based on input
    taskInput.addEventListener("input", () => {
      addBtn.disabled = taskInput.value.trim() === "";
    });
  
    // ✅ Feature: Press Enter to add task
    taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && taskInput.value.trim() !== "") {
        addTask();
      }
    });
  
    addBtn.addEventListener("click", addTask);
    clearAllBtn.addEventListener("click", clearAllTasks);
    themeToggle.addEventListener("click", toggleTheme);
  
    // ✅ Initial setup
    applySavedTheme();
    addBtn.disabled = true;
    renderTasks();
  })();
  






