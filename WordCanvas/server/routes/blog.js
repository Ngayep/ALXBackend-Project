const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const verifyToken = require("../middleware/auth"); // Auth middleware for protected routes
const { body, validationResult } = require("express-validator");

// Create a new blog post
router.post(
  "/",
   verifyToken,
   [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
   ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

 try {
    const { title, content } = req.body;
    const newPost = new BlogPost({
      title,
      content,
      author: req.user.id, // Extracted from the JWT
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
});

// Get all blog posts with pagination
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page

    const posts = await BlogPost.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name email");

    res.status(200).json(posts);
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
});

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
	  next(error); // Pass error to error handler middleware
  }
});

// Update a blog post
router.put(
   "/:id",
   verifyToken,
   [
     body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().notEmpty().withMessage("Content cannot be empty"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { title, content } = req.body;
    const post = await BlogPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    
    // Ensure the logged-in user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
 }
);

// Delete a blog post
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the logged-in user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await post.deleteOne(); // Delete the post
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
});


module.exports = router;
