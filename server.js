const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('connect-flash');
const mongoose = require("mongoose");

require('dotenv').config({ path: require('find-config')('.env') })

const User = require("./models/user.js");

mongoose.connect("mongodb://localhost/wave", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// general app config
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"));

// setting up passport
// Configure Sessions Middleware
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
  
  // Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.get("/login", (req, res) => {
    console.log(req.user)
    res.render("login");
});



app.get("/", (req, res) => {
    res.send(req.user.username);
});

app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      successRedirect: '/',
    }),
    (req, res) => {
      console.log(req.user);
    }
);
app.post("/register", (req, res) => {
    

    User.register({username: req.body.email}, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
        }

        else {
            console.log(user);
        }
    });
});

app.get("*", (req, res) => {
    res.render("unknown");
});

app.listen(8080, () => {
    console.log("SERVER STARTED");
});