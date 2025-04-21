const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Email đã tồn tại!' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Sai mật khẩu' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
