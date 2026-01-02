import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
