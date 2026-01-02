import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_, res) => {
  const posts = await Post.find().populate("author", "name");
  res.json(posts);
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    res.json(post);
  } catch (err) {
    res.status(404).json({ message: "Post not found" });
  }
});

// update post (author only)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // check ownership
    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
});

// delete post (author only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});



export default router;
