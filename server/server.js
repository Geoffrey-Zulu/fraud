const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const routes = require('./routes/routes');
const cors = require('cors');

require('dotenv').config(); 

const app = express();

// cors
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SECRET_KEY, // Use the secret key from the environment variables
  resave: false,
  saveUninitialized: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fraud_detection', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Passport local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Specify that 'email' is the username field
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Use the routes defined in routes.js
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
