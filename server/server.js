const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 3000;

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fraud_detection', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Passport JWT strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

app.use(passport.initialize());

// Authentication middleware
const ensureAuthenticated = passport.authenticate('jwt', { session: false });

// Use routes
app.use('/auth', authRoutes);
app.use('/transactions', ensureAuthenticated, transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
