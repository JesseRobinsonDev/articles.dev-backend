import mongoose from "mongoose";
import { articleDB } from "../../config/connections";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  created: { type: Date, defualt: new Date() },
});

export var articleModel = articleDB.model("article", articleSchema);
