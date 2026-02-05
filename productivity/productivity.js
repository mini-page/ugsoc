const baseKeys = ['todos', 'tasks', 'habits', 'notes', 'events', 'timer', 'theme', 'focus'];
const globalStorage = {
    get(key, fallback) {
        const raw = localStorage.getItem(`prod:${key}`);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch (err) {
            return fallback;
        }
    },
    set(key, value) {
        localStorage.setItem(`prod:${key}`, JSON.stringify(value));
    }
};

const storage = {
    prefix: () => {
        const profile = localStorage.getItem('prod:profile') || 'Default';
        return `prod:${profile}:`;
    },
    get(key, fallback) {
        const raw = localStorage.getItem(`${this.prefix()}${key}`);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch (err) {
            return fallback;
        }
    },
    set(key, value) {
        localStorage.setItem(`${this.prefix()}${key}`, JSON.stringify(value));
    },
    clearAll() {
        const prefix = this.prefix();
        baseKeys.forEach(key => localStorage.removeItem(`${prefix}${key}`));
    }
};

const views = document.querySelectorAll('.prod-view');
const navButtons = document.querySelectorAll('.prod-nav-btn');
const viewTitle = document.getElementById('prodViewTitle');
const profileSelect = document.getElementById('profileSelect');
const profileAdd = document.getElementById('profileAdd');
const profileRename = document.getElementById('profileRename');
const profileDelete = document.getElementById('profileDelete');
const profileTheme = document.getElementById('profileTheme');
const toggleFocus = document.getElementById('toggleFocus');
const exportBtn = document.getElementById('exportData');
const exportAll = document.getElementById('exportAll');
const importBtn = document.getElementById('importData');
const importFile = document.getElementById('importFile');
const showMonthlyTotal = document.getElementById('showMonthlyTotal');
const calendarToggles = document.querySelectorAll('[data-calendar]');
let calendarView = storage.get('calendarView', 'month');

const setView = (id) => {
    views.forEach(view => view.classList.toggle('active', view.dataset.view === id));
    navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
    const btn = Array.from(navButtons).find(b => b.dataset.target === id);
    if (btn && viewTitle) viewTitle.textContent = btn.dataset.title || 'Dashboard';
    storage.set('lastView', id);
};

navButtons.forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.target));
});

document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.jump));
});

document.querySelectorAll('[data-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.quick === 'focus') {
            setFocusMode(!document.body.classList.contains('prod-focus'));
        } else if (btn.dataset.quick === 'reset') {
            if (confirm('Reset today’s productivity data for this profile?')) {
                storage.clearAll();
                initAll();
            }
        }
    });
});

// Todos
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');

function renderTodos() {
    const todos = storage.get('todos', []);
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.className = 'prod-item';
        item.innerHTML = `
            <div>
                <strong>${todo.text}</strong>
                <small>${todo.done ? 'Completed' : 'Pending'}</small>
            </div>
            <div class="prod-item-actions">
                <button data-action="toggle">Done</button>
                <button data-action="delete">Delete</button>
            </div>
        `;
        item.querySelector('[data-action="toggle"]').addEventListener('click', () => {
            todo.done = !todo.done;
            storage.set('todos', todos);
            if (todo.done) logActivity(1);
            renderTodos();
            updateDashboard();
        });
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            storage.set('todos', todos.filter(t => t.id !== todo.id));
            renderTodos();
            updateDashboard();
        });
        todoList.appendChild(item);
    });
    if (!todos.length) {
        todoList.innerHTML = '<p class="prod-muted">No todos yet.</p>';
    }
}

todoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = todoForm.querySelector('input');
    const value = input.value.trim();
    if (!value) return;
    const todos = storage.get('todos', []);
    todos.push({ id: Date.now(), text: value, done: false });
    storage.set('todos', todos);
    input.value = '';
    renderTodos();
    updateDashboard();
});

// Tasks
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

function renderTasks() {
    const tasks = storage.get('tasks', []);
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'prod-item';
        item.innerHTML = `
            <div>
                <strong>${task.text}</strong>
                <small>${task.status}</small>
            </div>
            <div class="prod-item-actions">
                <button data-action="cycle">Next</button>
                <button data-action="delete">Delete</button>
            </div>
        `;
        item.querySelector('[data-action="cycle"]').addEventListener('click', () => {
            const order = ['todo', 'doing', 'done'];
            const idx = order.indexOf(task.status);
            const next = order[(idx + 1) % order.length];
            task.status = next;
            if (next === 'done') logActivity(1);
            storage.set('tasks', tasks);
            renderTasks();
            updateDashboard();
        });
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            storage.set('tasks', tasks.filter(t => t.id !== task.id));
            renderTasks();
            updateDashboard();
        });
        taskList.appendChild(item);
    });
    if (!tasks.length) {
        taskList.innerHTML = '<p class="prod-muted">No tasks yet.</p>';
    }
}

taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = taskForm.querySelector('input');
    const select = taskForm.querySelector('select');
    const value = input.value.trim();
    if (!value) return;
    const tasks = storage.get('tasks', []);
    tasks.push({ id: Date.now(), text: value, status: select.value });
    storage.set('tasks', tasks);
    input.value = '';
    renderTasks();
    updateDashboard();
});

// Habits
const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function renderHabits() {
    const habits = storage.get('habits', []);
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const row = document.createElement('div');
        row.className = 'prod-habit-row';
        row.innerHTML = `<span>${habit.name}</span>`;
        habit.days.forEach((value, index) => {
            const btn = document.createElement('button');
            btn.className = `prod-habit-day ${value ? 'is-active' : ''}`;
            btn.setAttribute('aria-label', `${habit.name} ${days[index]}`);
            btn.addEventListener('click', () => {
                habit.days[index] = !habit.days[index];
                const todayIndex = (new Date().getDay() + 6) % 7;
                if (index === todayIndex && habit.days[index]) {
                    logActivity(1);
                }
                storage.set('habits', habits);
                renderHabits();
                updateDashboard();
            });
            row.appendChild(btn);
        });
        habitList.appendChild(row);
    });
    if (!habits.length) {
        habitList.innerHTML = '<p class="prod-muted">No habits yet.</p>';
    }
}

habitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = habitForm.querySelector('input');
    const value = input.value.trim();
    if (!value) return;
    const habits = storage.get('habits', []);
    habits.push({ id: Date.now(), name: value, days: Array(7).fill(false) });
    storage.set('habits', habits);
    input.value = '';
    renderHabits();
    updateDashboard();
});

// Notes
const noteForm = document.getElementById('noteForm');
const noteList = document.getElementById('noteList');

function renderNotes() {
    const notes = storage.get('notes', []);
    noteList.innerHTML = '';
    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'prod-note';
        card.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.body}</p>
            <button data-action="delete">Delete</button>
        `;
        card.querySelector('[data-action="delete"]').addEventListener('click', () => {
            storage.set('notes', notes.filter(n => n.id !== note.id));
            renderNotes();
            updateDashboard();
        });
        noteList.appendChild(card);
    });
    if (!notes.length) {
        noteList.innerHTML = '<p class="prod-muted">No notes yet.</p>';
    }
}

noteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = noteForm.querySelector('input');
    const bodyInput = noteForm.querySelector('textarea');
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title || !body) return;
    const notes = storage.get('notes', []);
    notes.unshift({ id: Date.now(), title, body });
    storage.set('notes', notes);
    titleInput.value = '';
    bodyInput.value = '';
    renderNotes();
    updateDashboard();
});

// Events
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');

function renderEvents() {
    const events = storage.get('events', []);
    eventList.innerHTML = '';
    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'prod-item';
        item.innerHTML = `
            <div>
                <strong>${event.title}</strong>
                <small>${event.date}</small>
            </div>
            <div class="prod-item-actions">
                <button data-action="delete">Delete</button>
            </div>
        `;
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            storage.set('events', events.filter(e => e.id !== event.id));
            renderEvents();
            updateDashboard();
        });
        eventList.appendChild(item);
    });
    if (!events.length) {
        eventList.innerHTML = '<p class="prod-muted">No events yet.</p>';
    }
}

eventForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = eventForm.querySelector('input[type="date"]');
    const titleInput = eventForm.querySelector('input[type="text"]');
    const date = dateInput.value;
    const title = titleInput.value.trim();
    if (!date || !title) return;
    const events = storage.get('events', []);
    events.push({ id: Date.now(), date, title });
    storage.set('events', events);
    dateInput.value = '';
    titleInput.value = '';
    renderEvents();
    updateDashboard();
});

// Timer
const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerPause = document.getElementById('timerPause');
const timerReset = document.getElementById('timerReset');
const focusMinutes = document.getElementById('focusMinutes');
const breakMinutes = document.getElementById('breakMinutes');
const timerMode = document.getElementById('timerMode');

let timerInterval = null;
let remaining = 25 * 60;

const updateTimerDisplay = () => {
    const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
};

const setTimerFromInputs = () => {
    const focus = parseInt(focusMinutes.value, 10) || 25;
    const rest = parseInt(breakMinutes.value, 10) || 5;
    remaining = (timerMode.value === 'break' ? rest : focus) * 60;
    updateTimerDisplay();
};

timerStart?.addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (remaining > 0) {
            remaining -= 1;
            updateTimerDisplay();
            return;
        }
        clearInterval(timerInterval);
        timerInterval = null;
        if (timerMode.value === 'focus') {
            const minutes = parseInt(focusMinutes.value, 10) || 25;
            logFocus(minutes);
        }
    }, 1000);
});

timerPause?.addEventListener('click', () => {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
});

timerReset?.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    setTimerFromInputs();
});

[focusMinutes, breakMinutes, timerMode].forEach(input => {
    input?.addEventListener('change', setTimerFromInputs);
});

// Dashboard metrics
function updateDashboard() {
    const todos = storage.get('todos', []);
    const tasks = storage.get('tasks', []);
    const habits = storage.get('habits', []);
    document.getElementById('metricTodos').textContent = todos.filter(t => !t.done).length;
    document.getElementById('metricTasks').textContent = tasks.length;
    document.getElementById('metricHabits').textContent = habits.length;
    const doneToday = getTodayActivity();
    document.getElementById('metricDone').textContent = doneToday;
    document.getElementById('metricFocus').textContent = getFocusSessionsToday();
}

function initAll() {
    renderTodos();
    renderTasks();
    renderHabits();
    renderNotes();
    renderEvents();
    updateDashboard();
    setTimerFromInputs();
}

function loadProfiles() {
    const profiles = globalStorage.get('profiles', ['Default']);
    const current = localStorage.getItem('prod:profile') || 'Default';
    profileSelect.innerHTML = '';
    profiles.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        if (name === current) option.selected = true;
        profileSelect.appendChild(option);
    });
}

function switchProfile(name) {
    localStorage.setItem('prod:profile', name);
    loadProfiles();
    initAll();
    const lastView = storage.get('lastView', 'dashboard');
    setView(lastView);
    applyProfileTheme();
    applyFocusMode();
}

profileSelect?.addEventListener('change', (e) => {
    switchProfile(e.target.value);
});

profileAdd?.addEventListener('click', () => {
    const name = prompt('New profile name?');
    if (!name) return;
    const clean = name.trim();
    if (!clean) return;
    const profiles = globalStorage.get('profiles', ['Default']);
    if (!profiles.includes(clean)) {
        profiles.push(clean);
        globalStorage.set('profiles', profiles);
    }
    switchProfile(clean);
});

profileRename?.addEventListener('click', () => {
    const current = localStorage.getItem('prod:profile') || 'Default';
    const name = prompt('Rename profile:', current);
    if (!name) return;
    const clean = name.trim();
    if (!clean || clean === current) return;
    const profiles = globalStorage.get('profiles', ['Default']);
    if (profiles.includes(clean)) {
        alert('Profile name already exists.');
        return;
    }
    const index = profiles.indexOf(current);
    if (index === -1) return;
    profiles[index] = clean;
    globalStorage.set('profiles', profiles);
    // Move data keys to new prefix
    baseKeys.forEach((key) => {
        const oldKey = `prod:${current}:${key}`;
        const newKey = `prod:${clean}:${key}`;
        const value = localStorage.getItem(oldKey);
        if (value !== null) {
            localStorage.setItem(newKey, value);
            localStorage.removeItem(oldKey);
        }
    });
    localStorage.setItem('prod:profile', clean);
    loadProfiles();
    initAll();
});

profileDelete?.addEventListener('click', () => {
    const current = localStorage.getItem('prod:profile') || 'Default';
    if (current === 'Default') {
        alert('Default profile cannot be deleted.');
        return;
    }
    if (!confirm(`Delete profile "${current}" and all its data?`)) return;
    baseKeys.forEach((key) => {
        localStorage.removeItem(`prod:${current}:${key}`);
    });
    const profiles = globalStorage.get('profiles', ['Default']).filter(name => name !== current);
    globalStorage.set('profiles', profiles.length ? profiles : ['Default']);
    localStorage.setItem('prod:profile', profiles[0] || 'Default');
    loadProfiles();
    initAll();
});

profileTheme?.addEventListener('change', (e) => {
    storage.set('theme', e.target.value);
    applyProfileTheme();
});

toggleFocus?.addEventListener('click', () => {
    setFocusMode(!document.body.classList.contains('prod-focus'));
});

exportBtn?.addEventListener('click', () => {
    const payload = {
        profile: localStorage.getItem('prod:profile') || 'Default',
        data: {
            todos: storage.get('todos', []),
            tasks: storage.get('tasks', []),
            habits: storage.get('habits', []),
            notes: storage.get('notes', []),
            events: storage.get('events', []),
            theme: storage.get('theme', 'ember'),
            focus: storage.get('focus', false),
            timer: {
                focus: focusMinutes?.value || 25,
                break: breakMinutes?.value || 5,
                mode: timerMode?.value || 'focus'
            }
        }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ug-soc-playground-${payload.profile}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
});

exportAll?.addEventListener('click', () => {
    const profiles = globalStorage.get('profiles', ['Default']);
    const payload = {
        exportedAt: new Date().toISOString(),
        profiles: profiles.map((name) => ({
            name,
            data: {
                todos: JSON.parse(localStorage.getItem(`prod:${name}:todos`) || '[]'),
                tasks: JSON.parse(localStorage.getItem(`prod:${name}:tasks`) || '[]'),
                habits: JSON.parse(localStorage.getItem(`prod:${name}:habits`) || '[]'),
                notes: JSON.parse(localStorage.getItem(`prod:${name}:notes`) || '[]'),
                events: JSON.parse(localStorage.getItem(`prod:${name}:events`) || '[]'),
                theme: JSON.parse(localStorage.getItem(`prod:${name}:theme`) || '"ember"'),
                focus: JSON.parse(localStorage.getItem(`prod:${name}:focus`) || 'false')
            }
        }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ug-soc-playground-all.json';
    link.click();
    URL.revokeObjectURL(link.href);
});

importBtn?.addEventListener('click', () => {
    importFile?.click();
});

importFile?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const payload = JSON.parse(reader.result);
            if (!payload?.data) return;
            storage.set('todos', payload.data.todos || []);
            storage.set('tasks', payload.data.tasks || []);
            storage.set('habits', payload.data.habits || []);
            storage.set('notes', payload.data.notes || []);
            storage.set('events', payload.data.events || []);
            if (payload.data.theme) {
                storage.set('theme', payload.data.theme);
            }
            if (typeof payload.data.focus === 'boolean') {
                storage.set('focus', payload.data.focus);
            }
            if (payload.data.timer) {
                focusMinutes.value = payload.data.timer.focus || 25;
                breakMinutes.value = payload.data.timer.break || 5;
                timerMode.value = payload.data.timer.mode || 'focus';
                setTimerFromInputs();
            }
            applyProfileTheme();
            applyFocusMode();
            initAll();
        } catch (err) {
            alert('Import failed. Please use a valid JSON export.');
        }
    };
    reader.readAsText(file);
});

function applyProfileTheme() {
    const theme = storage.get('theme', 'ember');
    document.body.setAttribute('data-profile-theme', theme);
    if (profileTheme) {
        profileTheme.value = theme;
    }
}

function setFocusMode(enabled) {
    document.body.classList.toggle('prod-focus', enabled);
    storage.set('focus', enabled);
}

function applyFocusMode() {
    const enabled = storage.get('focus', false);
    document.body.classList.toggle('prod-focus', enabled);
}

function renderCalendar() {
    const container = document.getElementById('prodCalendar');
    if (!container) return;
    container.innerHTML = '';
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    if (calendarView === 'week') {
        const start = new Date(today);
        const offset = (today.getDay() + 6) % 7;
        start.setDate(today.getDate() - offset);
        days.forEach(day => {
            const div = document.createElement('div');
            div.textContent = day;
            div.className = 'prod-calendar-head';
            container.appendChild(div);
        });
        for (let i = 0; i < 7; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);
            const div = document.createElement('div');
            div.textContent = String(current.getDate());
            if (current.toDateString() === today.toDateString()) {
                div.classList.add('is-today');
            }
            container.appendChild(div);
        }
        return;
    }
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    days.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        div.className = 'prod-calendar-head';
        container.appendChild(div);
    });
    for (let i = 0; i < startOffset; i++) {
        const div = document.createElement('div');
        div.textContent = '';
        div.className = 'is-dim';
        container.appendChild(div);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const div = document.createElement('div');
        div.textContent = String(d);
        if (d === today.getDate()) {
            div.classList.add('is-today');
        }
        container.appendChild(div);
    }
}

function updateTimeLeft() {
    const valueEl = document.getElementById('timeLeftValue');
    const labelEl = document.getElementById('timeLeftLabel');
    const barEl = document.getElementById('timeLeftBar');
    if (!valueEl || !labelEl) return;
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const total = 24 * 60 * 60 * 1000;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    valueEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    labelEl.textContent = `${hours}h ${minutes}m remaining today`;
    if (barEl) {
        const remainingRatio = diff / total;
        barEl.style.width = `${Math.max(0, Math.min(1, remainingRatio)) * 100}%`;
    }
}

function renderNextEvent() {
    const el = document.getElementById('nextEvent');
    if (!el) return;
    const events = storage.get('events', []);
    if (!events.length) {
        el.textContent = 'No upcoming events.';
        return;
    }
    const today = new Date();
    const upcoming = events
        .map(event => ({ ...event, dateObj: new Date(event.date) }))
        .filter(event => !Number.isNaN(event.dateObj.getTime()) && event.dateObj >= today)
        .sort((a, b) => a.dateObj - b.dateObj)[0];
    if (!upcoming) {
        el.textContent = 'No upcoming events.';
        return;
    }
    el.innerHTML = `<strong>${upcoming.title}</strong><br><small>${upcoming.date}</small>`;
}

function logActivity(count) {
    const today = new Date().toISOString().slice(0, 10);
    const activity = storage.get('activity', {});
    activity[today] = (activity[today] || 0) + count;
    storage.set('activity', activity);
}

function getTodayActivity() {
    const today = new Date().toISOString().slice(0, 10);
    const activity = storage.get('activity', {});
    return activity[today] || 0;
}

function renderHeatmap() {
    const container = document.getElementById('habitHeatmap');
    if (!container) return;
    const activity = storage.get('activity', {});
    container.innerHTML = '';
    const days = 56;
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        const count = activity[key] || 0;
        const level = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4;
        const cell = document.createElement('div');
        cell.className = `cell ${level ? `level-${level}` : ''}`;
        cell.title = `${key}: ${count} completions`;
        container.appendChild(cell);
    }
}

function logFocus(minutes) {
    const today = new Date().toISOString().slice(0, 10);
    const focusLog = storage.get('focusLog', {});
    focusLog[today] = (focusLog[today] || 0) + minutes;
    storage.set('focusLog', focusLog);
    updateDashboard();
    renderFocusGraph();
}

function getFocusSessionsToday() {
    const today = new Date().toISOString().slice(0, 10);
    const focusLog = storage.get('focusLog', {});
    return focusLog[today] ? Math.ceil(focusLog[today] / (parseInt(focusMinutes.value, 10) || 25)) : 0;
}

function renderFocusGraph() {
    const container = document.getElementById('focusGraph');
    const labels = document.getElementById('focusGraphLabels');
    if (!container) return;
    const focusLog = storage.get('focusLog', {});
    container.innerHTML = '';
    if (labels) labels.innerHTML = '';
    const days = 7;
    const today = new Date();
    let max = 0;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        const minutes = focusLog[key] || 0;
        max = Math.max(max, minutes);
        data.push({ key, minutes, label: date.toLocaleDateString(undefined, { weekday: 'short' }) });
    }
    data.forEach(entry => {
        const bar = document.createElement('div');
        bar.className = 'prod-graph-bar';
        const height = max ? (entry.minutes / max) * 100 : 10;
        bar.style.height = `${Math.max(10, height)}%`;
        bar.title = `${entry.key}: ${entry.minutes} min`;
        container.appendChild(bar);
        if (labels) {
            const label = document.createElement('div');
            label.textContent = entry.label;
            labels.appendChild(label);
        }
    });
}

calendarToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        calendarView = btn.dataset.calendar;
        storage.set('calendarView', calendarView);
        calendarToggles.forEach(b => b.classList.toggle('active', b.dataset.calendar === calendarView));
        renderCalendar();
    });
    btn.classList.toggle('active', btn.dataset.calendar === calendarView);
});

function initAll() {
    renderTodos();
    renderTasks();
    renderHabits();
    renderNotes();
    renderEvents();
    updateDashboard();
    setTimerFromInputs();
    renderCalendar();
    updateTimeLeft();
    renderNextEvent();
    renderHeatmap();
    renderFocusGraph();
}

function updateMonthlyFocusTotal() {
    const totalEl = document.getElementById('focusTotal');
    if (!totalEl) return;
    const focusLog = storage.get('focusLog', {});
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let total = 0;
    Object.entries(focusLog).forEach(([key, minutes]) => {
        const date = new Date(key);
        if (date.getMonth() === month && date.getFullYear() === year) {
            total += minutes;
        }
    });
    totalEl.textContent = showMonthlyTotal?.checked ? `${total} min this month` : 'Monthly total hidden';
}

if (!localStorage.getItem('prod:profile')) {
    localStorage.setItem('prod:profile', 'Default');
    if (!globalStorage.get('profiles', null)) {
        globalStorage.set('profiles', ['Default']);
    }
}

loadProfiles();
applyProfileTheme();
applyFocusMode();
const lastView = storage.get('lastView', 'dashboard');
setView(lastView);
initAll();
setInterval(updateTimeLeft, 60000);
updateMonthlyFocusTotal();

showMonthlyTotal?.addEventListener('change', updateMonthlyFocusTotal);
