const Post = require("../models/Post");
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");
const { model } = require("mongoose");

exports.addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;
  //find post
  const post = await Post.findById(postId);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Please write a comment",
      success: "",
      post,
    });
  }
  //save comment
  const newComment = new Comment({
    content: req.body.comment,
    post: postId,
    author: req.user._id,
  });
  await newComment.save();
  post.comments.push(newComment._id);
  await post.save();
  console.log(post.comments);

  //redirect
  res.redirect(`/posts/${postId}`);
});

exports.getEditCommentPage = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  const post = await Post.findById(req.params.id);
  res.render("editComment", {
    title: "Edit Comment",
    user: req.user,
    comment,
    error: "",
    success: "",
    post,
  });
});

exports.editComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const commentId = req.params.commentId;

  // console.log("Post ID:", req.params.id);
  // console.log("Comment ID:", commentId);
  // console.log("New Comment Content:", comment);
  // console.log("Request Body:", req.body);

  const post = await Post.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "author",
      model: "User",
    },
  });
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Please write a comment",
      success: "",
      post,
    });
  }

  //instead of new comment
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: comment,
    },
    { new: true }
  );

  // console.log("Request Body:", req.body);
  // console.log("Comment updated successfully:", updatedComment);
  //redirect
  res.redirect(`/posts/${req.params.id}`);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const post = await Post.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "author",
      model: "User",
    },
  });
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/posts/${req.params.id}`);
});
