const asyncHandler = require("express-async-handler");
const upload = require("../config/multer");
const Post = require("../models/Post");
const File = require("../models/File");
const { model } = require("mongoose");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const auth = require("../middlewares/auth");

//rendering post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    error: "",
    success: "",
    input: { title: "", content: "" },
  });
});

//create new post
exports.createPost = asyncHandler(async (req, res) => {
  try {
    const { title, content } = req.body;
    //validation
    if (!req.files || req.files.length === 0) {
      return res.render("newPost", {
        title: "Create Post",
        user: req.user,
        error: "Please select an image",
        success: "",
        input: { title, content },
      });
    }
    const images = await Promise.all(
      req.files.map(async (file) => {
        //save images into database
        const newFile = new File({
          url: file.path,
          public_id: file.filename,
          uploaded_by: req.user._id,
        });
        await newFile.save();

        return {
          url: newFile.url,
          public_id: newFile.public_id,
        };
      })
    );
    const newPost = new Post({
      title,
      content,
      author: req.user._id,
      images,
    });
    await newPost.save();

    res.render("newPost", {
      title: "Create Post",
      user: req.user,
      success: "Post created successfully",
      error: "",
      input: { title, content },
    });
  } catch (error) {
    res.render("newPost", {
      title: "Create Post",
      user: req.user,
      error: error.message,
      success: "",
      input: { title, content },
    });
  }
});

//get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    user: req.user,
    posts,
    success: "",
    error: "",
  });
});

//get post by ID
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: { path: "author", model: "User", select: "username" },
    });

  res.render("postDetails", {
    title: "Post",
    author: post.author._id,
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

exports.editPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});
//update post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "You are not authorized to edit this post",
      success: "",
    });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );
  }
  if (req.files && req.files.length > 0) {
    post.images = await Promise.all(
      req.files.map(async (file) => {
        const newFile = new File({
          url: file.path,
          public_id: file.filename,
          uploaded_by: req.user._id,
        });
        await newFile.save();
        return {
          url: newFile.url,
          public_id: newFile.public_id,
        };
      })
    );
  }
  console.log(post);

  await post.save();
  res.redirect(`/posts/${post._id}`);
});

//delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "Post not found",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      error: "You are not authorized to delete this post",
    });
  }

  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    })
  );
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
