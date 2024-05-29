const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

function generateSimulatedFeatures() {
  return Array.from({ length: 28 }, () => Math.random() * 2 - 1);
}


router.post('/transaction', async (req, res) => {
  const { time, amount, senderAccount, receiverAccount } = req.body;

  if (!time || !amount || !senderAccount || !receiverAccount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Convert time to a timestamp
  const timestamp = new Date(time).getTime();
  if (isNaN(timestamp)) {
    return res.status(400).json({ message: 'Invalid time format' });
  }

  const simulatedFeatures = generateSimulatedFeatures();
  const features = [timestamp, parseFloat(amount), ...simulatedFeatures];

  try {
    console.log('Calling Flask microservice with features:', features);

    const response = await axios.post('http://localhost:5000/predict', { features });
    console.log('Flask microservice response:', response.data);

    const isFraud = response.data.prediction === 1;  // Update to check for fraud condition

    if (isFraud) {
      return res.status(400).json({ message: 'Transaction flagged as fraudulent', isFraud });
    }

    const sender = await User.findOne({ accountNumber: senderAccount });
    const receiver = await User.findOne({ accountNumber: receiverAccount });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    sender.transactions.push({ time, amount, isFraud });
    await sender.save();
    await receiver.save();

    res.json({ message: 'Transaction processed', senderBalance: sender.balance, receiverBalance: receiver.balance, isFraud });
  } catch (err) {
    console.error('Error processing transaction:', err.message);
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
});


router.get('/history', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).populate('transactions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ transactions: user.transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
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

    res.json({ message: 'Deposit successful', balance: user.balance, user });
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

    res.json({ message: 'Withdrawal successful', balance: user.balance, user });
  } catch (err) {
    console.error('Error processing withdrawal:', err.message);
    res.status(500).json({ message: 'Error processing withdrawal', error: err.message });
  }
});

module.exports = router;
