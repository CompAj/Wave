const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/user'); // Your User model

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Login-tut', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// EJS setup
app.set('view engine', 'ejs');
app.use(express.static("public")); 

// Express session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  

// Passport configuration
passport.use(new LocalStrategy({
    usernameField: 'username', // or 'email' if you are using the email to log in
    passwordField: 'password'
  }, User.authenticate()));
  
  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Connect-flash
app.use(flash());

// Middleware to pass flash messages to all templates
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// ...

// Routes

app.get('/', (req, res) => {
  res.render('login-page', { error: req.flash('error'), success: req.flash('success') });
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to view this page.');
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user });
});


// Handle login form submission
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/', // Redirect back to the combined page
    failureFlash: 'Invalid username or password.'
  })(req, res, next);
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      req.flash('error', 'Username already exists.');
      return res.redirect('/'); // Redirect back to the combined page
    }
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/'); // Redirect back to the combined page
      }
      req.flash('success', 'Successfully registered and logged in.');
      res.redirect('/dashboard');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/'); // Redirect back to the combined page
  }
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
