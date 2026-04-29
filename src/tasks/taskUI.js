import {
  updateVisualStates,
  startQuoteRotation,
  stopQuoteRotation,
} from "../ui/feedbackUI.js";

export function updateFilterCounts(getTasksFn) {
  const tasks = getTasksFn();

  const allBtn = document.querySelector('button[data-filter="all"]');
  const completedBtn = document.querySelector(
    'button[data-filter="completed"]'
  );
  const pendingBtn = document.querySelector(
    'button[data-filter="pending"]'
  );
  const pinnedBtn = document.querySelector(
    'button[data-filter="pinned"]'
  );

  if (!allBtn) return;

  allBtn.innerHTML = `All <span class="task-count">${tasks.length}</span>`;
  completedBtn.innerHTML = `Completed <span class="task-count">${tasks.filter(
    (t) => t.completed
  ).length}</span>`;
  pendingBtn.innerHTML = `Pending <span class="task-count">${tasks.filter(
    (t) => !t.completed
  ).length}</span>`;
  pinnedBtn.innerHTML = `Pinned <span class="task-count">${tasks.filter(
    (t) => t.isPinned
  ).length}</span>`;
}

export function renderTasks({
  mode = "",
  editIndex = -1,
  taskList,
  clearAllBtn,
  emptyState,
  fewTasksBanner,
  quoteText,
  motivationalQuotes,
  currentFilter,
  getTasksFn,
  toggleComplete,
  togglePin,
  editTask,
  deleteTask,
}) {
  taskList.innerHTML = "";

  const allTasks = getTasksFn();

  const filterBar = document.getElementById("taskFilters");

  if (filterBar) {
    filterBar.style.display = allTasks.length === 0 ? "none" : "flex";
  }

  let filteredTasks = allTasks
    .map((task, index) => ({
      ...task,
      originalIndex: index,
    }));

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((t) => t.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter((t) => !t.completed);
  } else if (currentFilter === "pinned") {
    filteredTasks = filteredTasks.filter((t) => t.isPinned);
  }

  filteredTasks.sort((a, b) => b.isPinned - a.isPinned);

  filteredTasks.forEach((task, sortedIndex) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.originalIndex = task.originalIndex;

    if (
      mode === "add" &&
      task.originalIndex === allTasks.length - 1
    ) {
      li.classList.add("add-animate");
    }

    if (mode === "edit" && task.originalIndex === editIndex) {
      li.classList.add("edit-animate");
    }

    const numberSpan = document.createElement("span");
    numberSpan.className = "task-number";
    numberSpan.textContent = `${sortedIndex + 1}. `;
    li.appendChild(numberSpan);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () =>
      toggleComplete(task.originalIndex)
    );
    li.appendChild(checkbox);

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", () =>
      toggleComplete(task.originalIndex)
    );

    li.appendChild(span);

    const pinBtn = document.createElement("button");
    pinBtn.className = "pin-btn";

    if (task.isPinned) {
      pinBtn.classList.add("pinned");
    }

    pinBtn.innerHTML = `<i data-lucide="${
      task.isPinned ? "pin" : "pin-off"
    }"></i>`;

    pinBtn.title = task.isPinned ? "Unpin Task" : "Pin Task";
    pinBtn.setAttribute("aria-label", pinBtn.title);

    pinBtn.addEventListener("click", () =>
      togglePin(task.originalIndex)
    );

    li.appendChild(pinBtn);

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
    editBtn.title = "Edit Task";
    editBtn.setAttribute("aria-label", "Edit Task");

    editBtn.addEventListener("click", () =>
      editTask(task.originalIndex, task.text)
    );

    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.title = "Delete Task";
    deleteBtn.setAttribute("aria-label", "Delete Task");

    deleteBtn.addEventListener("click", () =>
      deleteTask(task.originalIndex)
    );

    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateVisualStates({
    taskList,
    emptyState,
    fewTasksBanner,
    clearAllBtn,
    currentFilter,
    getTasksFn,
    startQuoteRotationFn: startQuoteRotation,
    stopQuoteRotationFn: stopQuoteRotation,
    quoteText,
    motivationalQuotes,
  });

  updateFilterCounts(getTasksFn);

  requestAnimationFrame(() => lucide.createIcons());

  if (mode === "edit" && editIndex !== -1) {
    const editedLi = [...taskList.children].find(
      (li) => Number(li.dataset.originalIndex) === editIndex
    );

    if (editedLi) {
      editedLi.classList.add("edit-saved");

      setTimeout(() => {
        editedLi.classList.remove("edit-saved");
      }, 700);
    }
  }
}