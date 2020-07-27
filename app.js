const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require('express-handlebars');
const path = require('path');


const app = express();
// Load User Model
require("./models/user");

// Passport Config
require("./config/passport")(passport);

//Connect to Database
mongoose
    .connect("mongodb://localhost/story-blocks", {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("MongoDB Connected !..");
    })
    .catch(err => {
        console.log("Something went Wrong");
    });

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Express Session
app.use(cookieParser());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false
    })
);

//Parsing Data
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global Variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Load Routes
const auth = require("./routes/auth");
const index = require('./routes/index');
const stories = require('./routes/stories');


// Use Routes
app.use('/', index)
app.use("/auth", auth);
app.use("/stories", stories);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});