export function renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback) {
    const list = document.getElementById('taskList');
    const emptyMsg = document.getElementById('emptyMessage');
  
    list.innerHTML = '';
    emptyMsg.classList.toggle('show', tasks.length === 0);
  
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
  
      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => onToggleComplete(index));
  
      // Number and Task Text in separate spans
      const containerSpan = document.createElement('span');
  
      const numberSpan = document.createElement('span');
      numberSpan.textContent = `${index + 1}. `;
      numberSpan.style.color = 'gray';
      numberSpan.style.marginRight = '5px';
  
      const taskTextSpan = document.createElement('span');
      taskTextSpan.textContent = task.text;
      if (task.completed) taskTextSpan.classList.add('completed');
  
      containerSpan.appendChild(numberSpan);
      containerSpan.appendChild(taskTextSpan);
  
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.classList.add('edit-btn');
      editBtn.innerHTML = '<i data-lucide="pencil"></i>';
      editBtn.title = 'Edit task';
  
      editBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';
  
        const handleEditComplete = () => {
          const newText = input.value.trim();
          if (newText && newText !== task.text) {
            onEditCallback(index, newText);
          } else {
            renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback);
          }
        };
  
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            handleEditComplete();
          } else if (e.key === 'Escape') {
            renderTasks(tasks, onRemoveCallback, onToggleComplete, onEditCallback);
          }
        });
  
        input.addEventListener('blur', handleEditComplete);
  
        li.replaceChild(input, containerSpan);
        input.focus();
      });
  
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
      deleteBtn.title = 'Delete task';
      deleteBtn.addEventListener('click', () => onRemoveCallback(index));
  
      // Append elements
      li.appendChild(checkbox);
      li.appendChild(containerSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  
    // Replace Lucide icons
    lucide.createIcons();
  }
  
  
  
  
  
  

  
