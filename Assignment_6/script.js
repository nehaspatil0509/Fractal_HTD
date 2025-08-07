function addtask() {
  const taskInput = document.getElementById('taskInput');
  const taskName = taskInput.value.trim();

  if (taskName === '') {
    alert('Please enter a task.');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Store as object with name and done status
  tasks.push({ name: taskName, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskInput.value = '';
  displayTasks();
}

function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const taskText = document.createElement('span');
    taskText.textContent = task.name;
    taskText.classList.add('task-text');

    if (task.done) {
      taskText.classList.add('task-done');
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('task-buttons');

    const doneButton = document.createElement('button');
    doneButton.textContent = task.done ? 'Undo' : 'Done';
    doneButton.className = 'done-button';
    doneButton.addEventListener('click', () => toggleDone(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deletetask(index));

    buttonsDiv.appendChild(doneButton);
    buttonsDiv.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
  });
}

function deletetask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}

function toggleDone(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}

window.onload = displayTasks;
