const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 7000;
const JWT_SECRET = 'your-secret-key';

const users = [];

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = {
            id: users.length + 1,
            name,
            email,
            password: password
        };

        users.push(user);

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const validPassword = (password === user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ 
            id: user.id, 
            email: user.email,
            password: user.password
        }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password.substring(0, 3)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/user', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email
    });
});

app.get('/data', authenticateToken, (req, res) => {
    res.json({
        stats: {
            totalUsers: users.length,
            activeUsers: users.length,
            lastUpdated: new Date().toISOString()
        },
        recentActivity: [
            { type: 'login', user: req.user.email, timestamp: new Date().toISOString() }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const tasks = [];

app.post('/tasks', authenticateToken, (req, res) => {
    const { title } = req.body;
    const task = {
        id: tasks.length + 1,
        title,
        completed: false,
        userId: req.user.id,
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.get('/tasks', authenticateToken, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    res.json(userTasks);
});

app.put('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const task = tasks.find(task => task.id === parseInt(id) && task.userId === req.user.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    res.json(task);
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id) && task.userId === req.user.id);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});