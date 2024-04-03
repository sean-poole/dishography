const express = require("express");
const app = express();
// !Change: Mongoose no longer required.
// const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");

const mainRoutes = require("./routes/main");
const profileRoutes = require("./routes/profile");
const favoritesRoutes = require("./routes/favorites");
const feedRoutes = require("./routes/feed");

// Use .env file in config folder.
require("dotenv").config({ path: "./config/.env"});

// Passport config
require("./config/passport")(passport);

// Connect to Database
connectDB();

// Use EJS for views
app.set("view engine", "ejs");

// Static Folder
app.use(express.static("public"));

// Body Parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
app.use(logger("dev"));

// Use forms for put / delete
app.use(methodOverride("_method"));

// Setup sessions - stored in MongoDB
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_STRING
        })
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, etc..
app.use(flash());

// Set cache-control headers for static images served from Cloudinary.
app.use("/public", (req, res, next) => {
    res.set("Cache-Control", "public, max-age=31557600");
    next();
});

// Setup routes for which the server is listening
app.use("/", mainRoutes);
app.use("/profile", profileRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/feed", feedRoutes);

// Server Running
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${process.env.PORT}`);
});
