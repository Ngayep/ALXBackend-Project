const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const verifyToken = require("../middleware/auth"); // Auth middleware for protected routes

// Create a new blog post
router.post("/", verifyToken, async (req, res) => {
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
    res.status(500).json({ message: "Error creating blog post", error });
  }
});

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author", "name email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts", error });
  }
});

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog post", error });
  }
});

// Update a blog post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await BlogPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized action" });

    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog post", error });
  }
});

// Delete a blog post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized action" });

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post", error });
  }
});

module.exports = router;
