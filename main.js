import { addTask, removeTask, getTasks, toggleComplete, editTask, clearAllTasks } from './todo.js';
import { renderTasks } from './dom.js';

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn'); // new

function updateUI() {
  renderTasks(
    getTasks(),
    (index) => {
      removeTask(index);
      updateUI();
    },
    (index) => {
      toggleComplete(index);
      updateUI();
    },
    (index, newText) => {
      editTask(index, newText);
      updateUI();
    }
  );
  clearAllBtn.style.display = getTasks().length ? 'inline-block' : 'none'; // show/hide
}

function validateInput() {
  const trimmed = input.value.trim();
  addBtn.disabled = trimmed === '';
}

input.addEventListener('input', validateInput);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

addBtn.addEventListener('click', () => {
  const task = input.value.trim();
  if (task) {
    addTask(task);
    input.value = '';
    updateUI();
    validateInput();
  }
});

clearAllBtn.addEventListener('click', () => {
  localStorage.removeItem('tasks');
  updateUI();
});

validateInput();
updateUI();




