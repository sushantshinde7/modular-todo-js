import { getTasks, saveTasks } from "./taskStore.js";
import { renderTasks } from "./taskUI.js";
import { showToast } from "../ui/feedbackUI.js";

export function addTask({
  taskInput,
  addBtn,
  toast,
  renderContext,
}) {
  const text = taskInput.value.trim();
  if (!text) return;

  const tasks = getTasks();
  tasks.push({
    text,
    completed: false,
    isPinned: false,
  });

  saveTasks(tasks);

  taskInput.value = "";

  renderTasks({
    ...renderContext,
    mode: "add",
  });

  showToast(toast, "Task added!", "add");

  addBtn.disabled = true;
}

export function toggleComplete({
  index,
  taskList,
  toast,
  renderContext,
}) {
  const tasks = getTasks();

  tasks[index].completed = !tasks[index].completed;

  saveTasks(tasks);

  renderTasks(renderContext);

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

  showToast(
    toast,
    tasks[index].completed
      ? "Task marked as completed!"
      : "Task marked as incomplete!",
    tasks[index].completed ? "complete" : "uncheck"
  );
}

export function togglePin({
  index,
  taskList,
  toast,
  renderContext,
}) {
  const beforeItems = [...taskList.children];
  const beforeRects = beforeItems.map((li) =>
    li.getBoundingClientRect()
  );

  const tasks = getTasks();
  tasks[index].isPinned = !tasks[index].isPinned;

  saveTasks(tasks);

  renderTasks(renderContext);

  const afterItems = [...taskList.children];
  const afterRects = afterItems.map((li) =>
    li.getBoundingClientRect()
  );

  afterItems.forEach((li, i) => {
    const before = beforeRects[i];
    const after = afterRects[i];

    if (!before || !after) return;

    const dx = before.left - after.left;
    const dy = before.top - after.top;

    li.style.transform = `translate(${dx}px, ${dy}px)`;
    li.style.transition = "transform 0ms";

    requestAnimationFrame(() => {
      li.style.transform = "";
      li.style.transition =
        "transform 450ms cubic-bezier(.2,.8,.2,1)";
    });

    li.addEventListener(
      "transitionend",
      () => {
        li.style.transition = "";
      },
      { once: true }
    );
  });

  const li = afterItems[index];
  const pinBtn = li?.querySelector(".pin-btn");

  if (pinBtn) {
    pinBtn.classList.add("pulse");
    setTimeout(() => pinBtn.classList.remove("pulse"), 380);
  }

  showToast(
    toast,
    tasks[index].isPinned ? "Task pinned!" : "Task unpinned!",
    tasks[index].isPinned ? "pin" : "unpin"
  );
}

export function deleteTask({
  index,
  taskList,
  toast,
  renderContext,
}) {
  const li = taskList.children[index];

  if (!li) return;

  li.classList.add("delete-animate");

  const tasks = getTasks();
  tasks.splice(index, 1);

  saveTasks(tasks);

  setTimeout(() => {
    renderTasks(renderContext);
    showToast(toast, "Task deleted!", "delete");
  }, 600);
}

export function editTask({
  index,
  oldText,
  taskList,
  toast,
  renderContext,
}) {
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
      showToast(toast, "Task cannot be empty!", "error");
      renderTasks(renderContext);
      return;
    }

    const tasks = getTasks();
    tasks[index].text = newText;

    saveTasks(tasks);

    renderTasks({
      ...renderContext,
      mode: "edit",
      editIndex: index,
    });

    showToast(toast, "Task updated!", "edit");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
}

export function clearAllTasks({
  taskList,
  toast,
  renderContext,
  animDuration,
}) {
  [...taskList.children].forEach((li) => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;

    li.style.setProperty("--x", `${randomX}px`);
    li.style.setProperty("--y", `${randomY}px`);

    li.classList.add("clear-animate");
  });

  setTimeout(() => {
    localStorage.removeItem("tasks");

    renderTasks(renderContext);

    showToast(toast, "All tasks cleared!", "clear");
  }, animDuration);
}