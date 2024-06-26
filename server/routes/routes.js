const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();
const saltRounds = 10;

function generateSimulatedFeatures() {
  return Array.from({ length: 28 }, () => Math.random() * 2 - 1);
}

// Registration route
router.post('/register', async (req, res) => {
  const { username, email, password, accountNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword, accountNumber, balance: 0 });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'User already exists or account number taken', error: err.message });
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
  const { time, amount, senderAccount, receiverAccount } = req.body;

  // Ensure all required fields are present
  if (!time || !amount || !senderAccount || !receiverAccount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Generate simulated features
  const simulatedFeatures = generateSimulatedFeatures();
  const features = [time, amount, ...simulatedFeatures];

  try {
    console.log('Calling Flask microservice with features:', features);

    // Call the Flask microservice for fraud detection
    const response = await axios.post('http://localhost:5000/predict', { features });
    console.log('Flask microservice response:', response.data);

    const isFraud = response.data.prediction === 0;

    if (isFraud) {
      return res.status(400).json({ message: 'Transaction flagged as fraudulent' });
    }

    // Find sender and receiver accounts
    const sender = await User.findOne({ accountNumber: senderAccount });
    const receiver = await User.findOne({ accountNumber: receiverAccount });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Deduct amount from sender and add to receiver
    sender.balance -= amount;
    receiver.balance += amount;

    // Record the transaction
    sender.transactions.push({ time, amount, isFraud });
    await sender.save();
    await receiver.save();

    res.json({ message: 'Transaction processed', senderBalance: sender.balance, receiverBalance: receiver.balance });
  } catch (err) {
    console.error('Error processing transaction:', err.message);
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
});

// Deposit route
router.post('/deposit', async (req, res) => {
  const { accountNumber, amount } = req.body;

  // Validate input
  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'Account number and amount are required' });
  }

  try {
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    user.balance += amount;
    await user.save();

    res.json({ message: 'Deposit successful', balance: user.balance });
  } catch (err) {
    console.error('Error processing deposit:', err.message);
    res.status(500).json({ message: 'Error processing deposit', error: err.message });
  }
});

// Withdraw route
router.post('/withdraw', async (req, res) => {
  const { accountNumber, amount } = req.body;

  // Validate input
  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'Account number and amount are required' });
  }

  try {
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    user.balance -= amount;
    await user.save();

    res.json({ message: 'Withdrawal successful', balance: user.balance });
  } catch (err) {
    console.error('Error processing withdrawal:', err.message);
    res.status(500).json({ message: 'Error processing withdrawal', error: err.message });
  }
});

module.exports = router;
