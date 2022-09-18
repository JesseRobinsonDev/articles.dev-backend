import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  searchUserArticles,
  searchUserComments,
} from "../controllers/userControllers";

const router = express.Router();

// Register user route, query parameters: Username, Password
router.post("/register", registerUser);

// Login user route, query parameters: Username, Password
router.post("/login", loginUser);

// Get user route, url parameters: UserID
router.get("/:id/get", getUser);

// Searches for articles made by the user, url parameters: UserID, query parameters: Limit, Offset
router.get("/:id/articles/search", searchUserArticles);

// Searches for comments made by the user, url parameters: UserID, query parameters: Limit, Offset
router.get("/:id/comments/search", searchUserComments);

// Deletes the user, url parameters: UserID
router.delete("/:id/delete", deleteUser);

export default router;
