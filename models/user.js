const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/wave", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    movies: [{type: String}]
});

userSchema.plugin(passportLocal);
const User = mongoose.model("User", userSchema);

module.exports = User;

