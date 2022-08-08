import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let userURI: string;
if (process.env.USERS_MONGO_URI) {
  userURI = process.env.USERS_MONGO_URI;
} else {
  throw new Error("Environment variable USERS_MONGO_URI not found");
}

let articleURI: string;
if (process.env.ARTICLES_MONGO_URI) {
  articleURI = process.env.ARTICLES_MONGO_URI;
} else {
  throw new Error("Environment variable ARTICLES_MONGO_URI not found");
}

export const userDB = mongoose.createConnection(userURI);
export const articleDB = mongoose.createConnection(articleURI);
