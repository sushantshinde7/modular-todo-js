import { addTask, removeTask, getTasks, toggleComplete, editTask } from './todo.js';
import { renderTasks } from './dom.js';

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');

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

validateInput();
updateUI();




