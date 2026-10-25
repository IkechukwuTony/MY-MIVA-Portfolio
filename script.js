/**
 * Main Script - Mobile Nav & LocalStorage Task Planner
 * Ikechukwu Tony Portfolio
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========================================================
    // 1. Mobile Navigation Logic
    // ========================================================
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-nav');
    const navLinks = document.querySelectorAll('.site-header nav a');

    let overlay = document.querySelector('.nav-overlay');
    if (!overlay && header) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        header.appendChild(overlay);
    }

    function toggleMenu() {
        if (!nav) return;
        const isOpen = nav.classList.toggle('open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', isOpen);
        }
        if (header) {
            header.classList.toggle('nav-open', isOpen);
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (nav) nav.classList.remove('open');
            if (header) header.classList.remove('nav-open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ========================================================
    // 2. Academic Planner Task Manager
    // ========================================================
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskTypeError = document.getElementById('task-title-error');
    const taskTypeSelect = document.getElementById('task-type');
    const taskDueInput = document.getElementById('task-due');
    const taskBody = document.getElementById('task-body');
    const taskCount = document.getElementById('task-count');

    if (!taskForm || !taskBody) return;

    // Load saved tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('ikechukwu_tasks')) || [];

    // Initial render on page load
    renderTasks();

    // Task form submission handler
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const type = taskTypeSelect ? taskTypeSelect.value : 'assignment';
        const due = taskDueInput ? taskDueInput.value : '';

        if (!title) {
            if (taskTypeError) taskTypeError.textContent = 'Please enter a task title.';
            taskTitleInput.focus();
            return;
        } else if (taskTypeError) {
            taskTypeError.textContent = '';
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            type,
            due: due || 'No due date',
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();

        taskForm.reset();
        taskTitleInput.focus();
    });

    // Event delegation on table body for clicks & changes
    taskBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('toggle-task')) {
            const id = e.target.getAttribute('data-id');
            const task = tasks.find((t) => t.id === id);
            if (task) {
                task.completed = e.target.checked;
                saveAndRender();
            }
        }
    });

    taskBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            tasks = tasks.filter((t) => t.id !== id);
            saveAndRender();
        }
    });

    // Save to localStorage and update DOM
    function saveAndRender() {
        localStorage.setItem('ikechukwu_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Render task list into HTML table
    function renderTasks() {
        taskBody.innerHTML = '';

        if (tasks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `<td colspan="5" style="text-align: center; color: var(--text-muted, #94a3b8); padding: 2rem;">No tasks added yet.</td>`;
            taskBody.appendChild(emptyRow);
            updateCount();
            return;
        }

        tasks.forEach((task) => {
            const tr = document.createElement('tr');
            if (task.completed) {
                tr.classList.add('is-completed');
            }

            // Friendly display names for task types
            let typeDisplay = task.type;
            if (task.type === 'assignment') typeDisplay = 'Assignment';
            else if (task.type === 'study') typeDisplay = 'Study Session';
            else if (task.type === 'exam') typeDisplay = 'Exam Prep';
            else if (task.type === 'studio') typeDisplay = 'Studio Session';
            else if (task.type === 'release') typeDisplay = 'Release Deadline';

            tr.innerHTML = `
        <td>
          <input type="checkbox" aria-label="Mark task as done" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-task">
        </td>
        <td class="task-title ${task.completed ? 'completed-text' : ''}">${escapeHTML(task.title)}</td>
        <td><span class="type-pill type-${task.type}">${typeDisplay}</span></td>
        <td>${escapeHTML(task.due)}</td>
        <td>
          <button type="button" class="btn-delete" data-id="${task.id}" aria-label="Delete task">Delete</button>
        </td>
      `;

            taskBody.appendChild(tr);
        });

        updateCount();
    }

    // Update total/completed counter
    function updateCount() {
        if (!taskCount) return;
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        taskCount.textContent = `${completed} of ${total} completed`;
    }

    // HTML sanitization helper
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});