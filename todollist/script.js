let tasks = [];

function addTask() {
  const taskTitleInput = document.getElementById('taskTitleInput');
  const taskDescriptionInput = document.getElementById('taskDescriptionInput');
  const taskTimeInput = document.getElementById('taskTimeInput');
  const taskTitle = taskTitleInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();
  const taskTime = taskTimeInput.value;
  if (taskTitle !== '') {
    const task = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      time: taskTime,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskTimeInput.value = '';
  }
}

function renderTasks(tasksToRender = tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasksToRender.forEach(task => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    titleSpan.addEventListener('click', () => editTaskTitle(task.id));
    if (task.completed) {
      titleSpan.style.textDecoration = 'line-through';
    }
    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = task.description;
    descriptionSpan.addEventListener('click', () => editTaskDescription(task.id));
    const timeSpan = document.createElement('span');
    timeSpan.textContent = task.time ? formatTime(task.time) : '';
    timeSpan.className = 'time'; // Add a class for styling
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    li.appendChild(checkbox);
    li.appendChild(titleSpan);
    if (task.description !== '') {
      li.appendChild(document.createElement('br'));
      li.appendChild(descriptionSpan);
    }
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(timeSpan); // Append the time span
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function editTaskTitle(id) {
  const task = tasks.find(task => task.id === id);
  const newTitle = prompt('Enter new task title:', task.title);
  if (newTitle !== null) {
    task.title = newTitle.trim();
    saveTasks();
    renderTasks();
  }
}

function editTaskDescription(id) {
  const task = tasks.find(task => task.id === id);
  const newDescription = prompt('Enter new task description:', task.description);
  if (newDescription !== null) {
    task.description = newDescription.trim();
    saveTasks();
    renderTasks();
  }
}

function editTask(id) {
  editTaskTitle(id);
  editTaskDescription(id);
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

function formatTime(timeString) {
  const time = new Date(timeString);
  const hours = time.getHours() % 12 || 12; // Convert hours to 12-hour format
  const minutes = time.getMinutes().toString().padStart(2, '0'); // Add leading zero if minutes < 10
  const meridiem = time.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM
  return `${hours}:${minutes} ${meridiem}`;
}

function searchTasks() {
  const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
  const filteredTasks = tasks.filter(task => {
    return task.title.toLowerCase().includes(searchInput) || task.description.toLowerCase().includes(searchInput);
  });
  renderTasks(filteredTasks);
}

loadTasks();
