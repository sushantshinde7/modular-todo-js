// todo.js

const STORAGE_KEY = 'todoTasks';
let tasks = loadTasks();

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
}

export function getTasks() {
  return tasks;
}

export function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

export function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

export function editTask(index, newText) {
    tasks[index].text = newText;
    saveTasks();
  }
  
