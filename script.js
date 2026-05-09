const form       = document.getElementById('task-form');
const nameInput  = document.getElementById('task-name');
const dateInput  = document.getElementById('task-date');
const formError  = document.getElementById('form-error');
const taskList   = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    year:    'numeric',
    month:   'short',
    day:     'numeric',
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateEmptyState() {
  emptyState.classList.toggle('hidden', taskList.children.length > 0);
}

function deleteTask(id) {
  const card = taskList.querySelector(`[data-id="${id}"]`);
  if (!card) return;
  card.remove();
  updateEmptyState();
}

function renderTask(task) {
  const card = document.createElement('div');
  card.dataset.id = task.id;
  card.className = 'bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border-l-4 border-indigo-300';

  card.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-gray-800 font-semibold text-base leading-snug break-words flex-1">
        ${escapeHtml(task.name)}
      </h3>
      <button
        class="delete-btn flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors duration-150 text-xl leading-none cursor-pointer"
        aria-label="Delete task"
        title="Delete task"
      >✕</button>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-400 text-sm">📅 ${formatDate(task.date)}</span>
    </div>
  `;

  card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
  taskList.appendChild(card);
  updateEmptyState();
}

function addTask(name, date) {
  const task = { id: crypto.randomUUID(), name: name.trim(), date };
  renderTask(task);
}

function showError() {
  formError.classList.remove('hidden');
  if (!nameInput.value.trim()) {
    nameInput.classList.add('border-red-400', 'ring-2', 'ring-red-200');
  }
  if (!dateInput.value) {
    dateInput.classList.add('border-red-400', 'ring-2', 'ring-red-200');
  }
}

function clearError() {
  formError.classList.add('hidden');
  nameInput.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
  dateInput.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();

  const name = nameInput.value.trim();
  const date = dateInput.value;

  if (!name || !date) {
    showError();
    return;
  }

  addTask(name, date);
  nameInput.value = '';
  dateInput.value = '';
  nameInput.focus();
});

nameInput.addEventListener('input', () => {
  nameInput.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
  if (nameInput.value.trim() && dateInput.value) clearError();
});

dateInput.addEventListener('change', () => {
  dateInput.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
  if (nameInput.value.trim() && dateInput.value) clearError();
});

updateEmptyState();
