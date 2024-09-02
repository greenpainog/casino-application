const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8080;
const JWT_SECRET = 'your-secret-key'; // Use a more secure key in production
// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


const users = []; // Sample in-memory database

// Registration endpoint
app.post('/api/player/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully.' });
});


// Login endpoint
app.post('/api/player/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = users.find(user => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful.', token });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// Fetch user profile endpoint
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.sendStatus(404);
    res.json({ username: user.username });
});

// Update user profile endpoint
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    const { newPassword } = req.body;

    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.sendStatus(404);

    if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
    }

    res.json({ message: 'Profile updated successfully.' });
});

app.put('/api/user/balance', authenticateToken, (req, res) => {
    const { balance } = req.body;
    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.sendStatus(404);

    // Ensure the balance is valid (e.g., not negative)
    if (balance < 0) return res.status(400).json({ message: 'Invalid balance amount.' });

    user.balance = balance;

    res.json({ message: 'Balance updated successfully.' });
});


