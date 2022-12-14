import mongoose from "mongoose";
import { userDB } from "../../config/connections";

const userSchema = new mongoose.Schema({
  jwtToken: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userArticleIDs: [String],
  userCommentIDs: [String],
  dateJoined: { type: Date, default: Date.now },
});

export var userModel = userDB.model("user", userSchema);
