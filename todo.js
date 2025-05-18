// todo.js

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
}

export function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

export function getTasks() {
  return tasks;
}

export function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

export function editTask(index, newText) {
  tasks[index].text = newText;
  saveTasks();
}

export function clearAllTasks() {
  tasks = [];
  saveTasks();
}

