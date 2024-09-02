const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const {
  getLoginPage,
  login,
  getRegisterPage,
  register,
  logout,
} = require("../controllers/authController");

//login page
authRoutes.get("/login", getLoginPage);
//Main logic for login page

authRoutes.post("/login", login);

//register page
authRoutes.get("/register", getRegisterPage);
//Main logic for user registration

authRoutes.post("/register", register);

//logout
authRoutes.get("/logout", logout);

module.exports = authRoutes;
