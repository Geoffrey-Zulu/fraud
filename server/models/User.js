const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  time: { type: Number, required: true },
  amount: { type: Number, required: true },
  isFraud: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, required: true, default: 1000 },
  transactions: [transactionSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
