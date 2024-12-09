const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Agent');

// POST: User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
