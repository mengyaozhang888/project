const express = require("express");
const commentRoutes = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { ensureAuthenticated } = require("../middlewares/auth");
const {
  addComment,
  getEditCommentPage,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

//add comments
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

//get edit comment page
commentRoutes.get(
  "/posts/:id/:commentId/edit",
  ensureAuthenticated,
  getEditCommentPage
);
//edit comments
commentRoutes.put(
  "/posts/:id/:commentId/edit",
  ensureAuthenticated,
  editComment
);

commentRoutes.delete(
  "/posts/:id/:commentId",
  ensureAuthenticated,
  deleteComment
);
module.exports = commentRoutes;
