// todo.js

const STORAGE_KEY = 'todoTasks';
let tasks = loadTasks();

// Load tasks from localStorage
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse tasks from storage:', e);
    return [];
  }
}

// Save tasks to localStorage
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

// Add a new task
export function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
}

// Get all tasks
export function getTasks() {
  return tasks;
}

// Remove a task by index
export function removeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

// Toggle task completion status
export function toggleComplete(index) {
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
  }
}

// Edit a task's text
export function editTask(index, newText) {
  if (tasks[index]) {
    tasks[index].text = newText;
    saveTasks();
  }
}

// ✅ New: Clear all tasks
export function clearAllTasks() {
  tasks = [];
  saveTasks();
}
