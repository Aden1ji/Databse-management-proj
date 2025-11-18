const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Register (plain text password)
router.post('/register', async (req, res) => {
  try {
    const { fname, lname, email, password, phone, car_id } = req.body;

    const user = await User.create({
      fname,
      lname,
      email,
      password, // no hashing
      phone,
      car_id,
      role: 'user'
    });

    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (plain text password compare)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (password !== user.password)
      return res.status(401).json({ error: 'Invalid password' });

    req.session.user = {
      id: user.user_id,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Login successful',
      redirect: '/frontend/views.html'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
