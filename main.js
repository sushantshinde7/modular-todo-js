// main.js
import { addTask, removeTask, getTasks, toggleComplete, editTask, clearAllTasks } from './todo.js';
import { renderTasks } from './dom.js';

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

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
  clearAllBtn.style.display = getTasks().length ? 'inline-block' : 'none';
}

function validateInput() {
  const trimmed = input.value.trim();
  addBtn.disabled = trimmed === '';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
  
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000); // Toast visible for 2s
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

// ✅ Clear all tasks when clicked (NO confirm box)
clearAllBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Ensure no default form behavior
  clearAllTasks();
  updateUI();
  showToast("All tasks cleared!");//shows a toast message
});

validateInput();
updateUI();






