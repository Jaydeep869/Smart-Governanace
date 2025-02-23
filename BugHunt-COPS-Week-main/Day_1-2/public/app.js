const API_URL = 'http://localhost:7000'
const TOKEN_KEY = 'auth_token';

const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const api = {
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getUserData() {
        try {
            const response = await fetch(`${API_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getApiData() {
        try {
            const response = await fetch(`${API_URL}/data`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getTasks() {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async addTask(title) {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ title }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async updateTask(id, updates) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) throw new Error('Error deleting task');
        } catch (error) {
            throw new Error(error.message);
        }
    },

};

const elements = {
    authForms: document.getElementById('authForms'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    loginError: document.getElementById('loginError'),
    registerError: document.getElementById('registerError'),
    dashboard: document.getElementById('dashboard'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    apiData: document.getElementById('apiData'),
    logoutBtn: document.getElementById('logoutBtn'),
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskList: document.getElementById('taskList'),
};

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const { token, user } = await api.login({ email, password });
        localStorage.setItem('user_password', password);
        localStorage.setItem('user_email', email);
        setToken(token);
        showDashboard(user);
    } catch (error) {
        elements.loginError.textContent = error.message;
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (password.length > 0) {
        try {
            console.log('New user password:', password);
            
            const { token, user } = await api.register({ 
                name, 
                email, 
                password,
            });
            setToken(token);
            sessionStorage.setItem('credentials', JSON.stringify({email, password}));
            showDashboard(user);
        } catch (error) {
            elements.registerError.textContent = error.message;
        }
    }
};

const handleLogout = (e) => {
    e.preventDefault();
    removeToken();
    showAuth();
};

const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const title = elements.taskTitle.value;
    try {
        const task = await api.addTask(title);
        addTaskToUI(task);
        elements.taskTitle.value = '';
    } catch (error) {
        console.error(error.message);
    }
};

const handleTaskToggle = async (id, completed) => {
    updateTaskInUI(id, { completed });
    try {
        await api.updateTask(id, { completed });
    } catch (error) {
        console.error(error.message);
    }
};

const handleTaskDelete = async (id) => {
    try {
        await api.deleteTask(id);
        removeTaskFromUI(id);
    } catch (error) {
        console.error(error.message);
    }
};

const addTaskToUI = (task) => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed fade-in' : 'fade-in';
    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="handleTaskToggle(${task.id}, this.checked)">
        <span>${task.title}</span>
        <button onclick="handleTaskDelete(${task.id})">Delete</button>
    `;
    elements.taskList.appendChild(li);
};

const updateTaskInUI = (id, updates) => {
    const taskElement = elements.taskList.querySelector(`[data-id="${id}"]`);
    if (updates.completed !== undefined) {
        taskElement.querySelector('input[type="checkbox"]').checked = updates.completed;
        taskElement.classList.toggle('completed', updates.completed);
    }
};

const removeTaskFromUI = (id) => {
    const taskElement = elements.taskList.querySelector(`[data-id="${id}"]`);
    taskElement.style.transform = 'translateX(100%)';
    taskElement.style.opacity = '0';
    setTimeout(() => taskElement.remove(), 300);
};

const loadTasks = async () => {
    try {
        const tasks = await api.getTasks();
        tasks.forEach(addTaskToUI);
    } catch (error) {
        console.error(error.message);
    }
};

const showDashboard = async (user) => {
    elements.authForms.style.display = 'none';
    elements.dashboard.style.display = 'block';
    elements.logoutBtn.style.display = 'block';
    elements.userName.textContent = user.name;
    elements.userEmail.textContent = user.email;
    
    try {
        const apiData = await api.getApiData();
        elements.apiData.textContent = JSON.stringify(apiData, null, 2);
    } catch (error) {
        elements.apiData.textContent = 'Error loading data';
    }
    await loadTasks();
};

elements.dashboard.classList.add('visible');

const showAuth = () => {
    elements.authForms.style.display = 'block';
    elements.dashboard.style.display = 'none';
    elements.logoutBtn.style.display = 'none';
    elements.loginForm.reset();
    elements.registerForm.reset();
};


elements.loginForm.addEventListener('submit', handleLogin);
elements.registerForm.addEventListener('submit', handleRegister);
elements.logoutBtn.addEventListener('click', handleLogout);

elements.showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    elements.loginForm.style.display = 'none';
    elements.registerForm.style.display = 'block';
});
elements.showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    elements.registerForm.style.display = 'none';
    elements.loginForm.style.display = 'block';
});
elements.taskForm.addEventListener('submit', handleTaskSubmit);

const init = async () => {
    const token = getToken();
    if (token) {
        try {
            const user = await api.getUserData();
            showDashboard(user);
        } catch (error) {
            removeToken();
            showAuth();
        }
    } else {
        showAuth();
    }
};

init();
