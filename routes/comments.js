import express from "express";
import Comment from "../models/Comment.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// ➜ Add a comment
router.post("/", auth, async (req, res) => {
  try {
    const { text, postId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ message: "text and postId are required" });
    }

    const comment = await Comment.create({
      text,
      postId,
      userId: req.user
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// ➜ Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name")     // show commenter name only
      .sort({ createdAt: -1 });       // newest first

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

export default router;
