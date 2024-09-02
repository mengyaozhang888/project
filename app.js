require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoStore = require("connect-mongo");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const passportConfig = require("./config/passport");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const { title } = require("process");
const { error } = require("console");
const commentRoutes = require("./routes/commentRoutes");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//port
const PORT = process.env.PORT || 3000;

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  })
);

//method override
app.use(methodOverride("_method"));
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use("local", passportConfig);
passportConfig(passport);

//EJS
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(errorHandler);
//Home Routes
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    user: req.user,
    error: "",
  });
});
//routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

//start server

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to the database");
    app.listen(PORT, () => {
      console.log("server is running on port " + PORT);
    });
  })
  .catch(() => {
    console.log("Error connecting to the database");
  });
