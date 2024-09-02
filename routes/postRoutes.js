const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  editPost,
  updatePost,
  deletePost,
} = require("../controllers/postControllers");
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");
const { post } = require("./authRoutes");
const postRouter = express.Router();

postRouter.get("/", getPosts);

postRouter.get("/add", getPostForm);

postRouter.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost
);

postRouter.get("/:id", getPostById);

postRouter.get("/:id/edit", editPost);

postRouter.put(
  "/:id/",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost
);

postRouter.delete("/:id", ensureAuthenticated, deletePost);
module.exports = postRouter;
