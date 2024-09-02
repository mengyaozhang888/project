const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
// render login page
exports.getLoginPage = asyncHandler((req, res) => {
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
});
//login logic

exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect("/user/profile");
    });
  })(req, res, next);
});

// render register page
exports.getRegisterPage = asyncHandler((req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

// register logic
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
});

//Logout
exports.logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("/auth/login");
});
