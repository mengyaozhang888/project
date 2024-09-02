const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const { ensureAuthenticated } = require("../middlewares/auth");
const { getUserProfile } = require("../controllers/userController");
const { editUserProfile } = require("../controllers/userController");
const { updateUserProfile } = require("../controllers/userController");
const upload = require("../config/multer");
const { deleteAccount } = require("../controllers/userController");

//login page
userRoutes.get("/profile", ensureAuthenticated, getUserProfile);
userRoutes.get("/edit", ensureAuthenticated, editUserProfile);
userRoutes.post(
  "/edit",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateUserProfile
);
userRoutes.post("/delete", ensureAuthenticated, deleteAccount);

module.exports = userRoutes;
