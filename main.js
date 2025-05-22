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
  
    const renderTasks = () => {
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
  






