import mongoose from "mongoose";
import { articleDB } from "../../config/connections";

const commentSchema = new mongoose.Schema({
  authorID: { type: String, required: true },
  authorUsername: { type: String, required: true },
  commentBody: { type: String, required: true },
  articleID: { type: String, required: true },
  articleTitle: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
});

export var commentModel = articleDB.model("comment", commentSchema);

