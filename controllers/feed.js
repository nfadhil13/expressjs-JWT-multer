const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../model/post");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perpage || 10;
  const offset = (currentPage-1) * perPage;
  try {
    const post = await Post.findAll({
      limit : perPage,
      offset : offset
    });
    res.status(200).json({
      message: "Succes retrieve posts",
      data: post,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Failed , not right input");
      error.statusCode = 422;
      error.cause = errors.array();
      throw error;
    }
    if (!req.file) {
      const error = new Error("No Image Provided");
      error.statusCode = 422;
      console.log("no file");
      throw error;
    }
    const imageUrl = req.file.path
    const title = req.body.title;
    const content = req.body.content;
    console.log(title);
    // Create post in db
    const postDB = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
    });
    res.status(201).json({
      message: "Post created successfully!",
      data: postDB,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  const id = req.params.postId;
  console.log(id);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      const error = new Error("Could not find specific post");
      error.statusCode = 404;
      error.cause = "Invaid Post ID";
      throw error;
    }
    res.status(200).json({
      message: "Succes retrieve data",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

exports.editPostById = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Failed , not right input");
      error.statusCode = 422;
      error.cause = errors.array();
      throw error;
    }
    const id = req.params.postId;
    const post = await Post.findByPk(id);
    if (!post) {
      const error = new Error("Could not find specific post");
      error.statusCode = 404;
      error.cause = "Invaid Post ID";
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      const plainImageUrl = req.file.path;
      imageUrl = plainImageUrl.replace(/\\/gi, "/");
      console.log(imageUrl);
    }
    if (imageUrl !== post.imageUrl) {
      deleteImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    await post.save();
    res.status(200).json({
      message: "Post Updated",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

exports.detelePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new Error("Could not find specific post");
      error.statusCode = 404;
      error.cause = "Invaid Post ID";
      throw error;
    }
    deleteImage(post.imageUrl);
    await post.destroy();
    res.status(200).json({
      message: "Post Deleted",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

const deleteImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
