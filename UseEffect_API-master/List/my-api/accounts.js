const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');


const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('❌ Lỗi đọc file:', err);
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: '❌Tài khoản đã tồn tại!' });
    }

    users.push({ username, password });
    writeUsers(users);
    res.status(201).json({ message: '✅Đăng ký thành công!' });

});
app.get('/api/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu!' });
    }

    res.status(200).json({ message: '✅ Đăng nhập thành công!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});