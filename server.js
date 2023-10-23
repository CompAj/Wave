const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("*", (req, res) => {
    res.redirect("/login");
});

app.post("/login", (req, res) => {

});

app.post("/register", (req, res) => {

});

app.listen(8080, () => {
    console.log("SERVER STARTED");
});