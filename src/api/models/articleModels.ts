import mongoose from "mongoose";
import { articleDB } from "../../config/connections";

const articleSchema = new mongoose.Schema({
  authorID: { type: String, required: true },
  authorUsername: { type: String, required: true },
  articleTitle: { type: String, required: true },
  articleBody: { type: String, required: true },
  articleTags: [String],
  articleCommentIDs: [String],
  dateCreated: { type: Date, default: Date.now },
});

export var articleModel = articleDB.model("article", articleSchema);
