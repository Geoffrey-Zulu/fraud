const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt'); 
const User = require('../models/User'); 

const router = express.Router();
const saltRounds = 10; 

// Registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
    const newUser = new User({ username, email, password: hashedPassword, balance: 1000 });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'User already exists', error: err.message });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Failed, check your email and password' });

    // Manually log in the user
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Protected route example
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout(); // Passport.js handles the session termination
  res.json({ message: 'Logout successful' });
});

// Transaction route
router.post('/transaction', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { time, amount } = req.body;
  const userId = req.user._id;

  // Simulate fraud detection (replace with actual model prediction)
  const isFraud = Math.random() < 0.5; // Randomly flagging as fraud for demonstration

  try {
    const user = await User.findById(userId);
    if (!isFraud) {
      user.balance -= amount;
    }
    user.transactions.push({ time, amount, isFraud });
    await user.save();

    res.json({ message: 'Transaction processed', isFraud, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
});

module.exports = router;
