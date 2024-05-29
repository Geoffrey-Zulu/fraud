const express = require('express');
const bcrypt = require('bcrypt'); 
const axios = require('axios'); 
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
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
    console.log(err)
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

// Transaction route
router.post('/transaction', async (req, res) => {
  const { time, amount, features, } = req.body; 

  // Ensure features array has the correct length
  if (!features || features.length !== 30) {
    return res.status(400).json({ message: 'Invalid features length' });
  }

  try {
    console.log('Calling Flask microservice with features:', features);

    // Call the Flask microservice for fraud detection
    const response = await axios.post('http://localhost:5000/predict', { features });
    const isFraud = response.data.prediction === 0;

    console.log('Flask microservice response:', response.data);

    // For now, just return the prediction result without user-specific logic
    res.json({ message: 'Transaction processed', isFraud });
  } catch (err) {
    console.error('Error processing transaction:', err.message);
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
});

router.post('/deposit'), async (req, res) => {
  
}
router.post('/withdraw'), async (req, res) => {
  
}
router.post('/history'), async (req, res) => {
  
}
module.exports = router;
