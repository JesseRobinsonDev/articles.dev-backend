import mongoose from "mongoose";
import { userDB } from "../../config/connections";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  articles: [String],
  joined: { type: Date, defualt: new Date() },
});

export var userModel = userDB.model("user", userSchema);
