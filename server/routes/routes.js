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
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
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

   
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});


module.exports = router;
