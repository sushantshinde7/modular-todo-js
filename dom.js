// renderTasks.js
// ✅ Safe optimizations and minor readability improvements only
// ✅ Core logic untouched

export function renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback) {
  const list = document.getElementById('taskList');
  const emptyMsg = document.getElementById('emptyMessage');

  // 🔹 Clear list efficiently
  list.textContent = ''; // (changed from innerHTML = '') - faster & safer for DOM cleanup

  // 🔹 Toggle empty message visibility
  emptyMsg.classList.toggle('show', tasks.length === 0);

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    // --- Main container ---
    const containerSpan = document.createElement('span');
    containerSpan.className = 'task-container';

    // --- Number ---
    const numberSpan = document.createElement('span');
    numberSpan.textContent = `${index + 1}. `;
    numberSpan.className = 'task-number'; // (no change, kept semantic clarity)

    // --- Checkbox ---
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    // ✅ Arrow function concise event binding
    checkbox.addEventListener('change', () => onToggleComplete(index));

    // --- Task text ---
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskTextSpan.className = 'task-text';
    if (task.completed) taskTextSpan.classList.add('completed');

    // Append all to container
    containerSpan.append(numberSpan, checkbox, taskTextSpan); // (changed from multiple appendChilds)

    // --- Edit Button ---
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i data-lucide="pencil"></i>';
    editBtn.title = 'Edit task';

    editBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.className = 'edit-input';

      const handleEditComplete = () => {
        const newText = input.value.trim();
        // 🔹 Early return style for better readability
        if (!newText) return renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback);
        if (newText !== task.text) onEditCallback(index, newText);
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleEditComplete();
        else if (e.key === 'Escape') renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback);
      });

      input.addEventListener('blur', handleEditComplete);

      li.replaceChild(input, containerSpan);
      input.focus();
    });

    // --- Delete Button ---
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => onRemoveCallback(index));

    // Append all to list item
    li.append(containerSpan, editBtn, deleteBtn); // (shorter syntax)
    list.appendChild(li);
  });

  // 🔹 Replace Lucide icons (re-renders SVGs)
  lucide.createIcons();
}

  
  
  
  
  
  

  
