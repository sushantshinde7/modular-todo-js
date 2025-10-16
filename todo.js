// todo.js
// ✅ No logic changes — only cleanup, safety, and readability improvements

const STORAGE_KEY = 'todoTasks';
let tasks = loadTasks();

// --- Load tasks from localStorage ---
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('❌ Failed to parse tasks from storage:', e);
    return [];
  }
}

// --- Save tasks to localStorage ---
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('❌ Failed to save tasks:', e);
  }
}

// --- Add a new task ---
export function addTask(text) {
  if (!text.trim()) return; // 🔹 Prevent adding empty tasks
  tasks.push({ text: text.trim(), completed: false });
  saveTasks();
}

// --- Get all tasks ---
export function getTasks() {
  return [...tasks]; // 🔹 Return shallow copy for safety (prevents accidental mutation)
}

// --- Remove a task by index ---
export function removeTask(index) {
  if (index < 0 || index >= tasks.length) return; // 🔹 Early guard
  tasks.splice(index, 1);
  saveTasks();
}

// --- Toggle task completion ---
export function toggleComplete(index) {
  const task = tasks[index];
  if (!task) return; // 🔹 Safety check
  task.completed = !task.completed;
  saveTasks();
}

// --- Edit a task text ---
export function editTask(index, newText) {
  const task = tasks[index];
  if (!task || !newText.trim()) return;
  task.text = newText.trim();
  saveTasks();
}

// --- Clear all tasks ---
export function clearAllTasks() {
  tasks = [];
  saveTasks();
}
