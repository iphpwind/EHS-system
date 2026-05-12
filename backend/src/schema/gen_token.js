const jwt = require('jsonwebtoken');
const token = jwt.sign({ username: 'admin', userId: 1, role: 1 }, 'safety-system-secret-2026', { expiresIn: '7d' });
console.log(token);
