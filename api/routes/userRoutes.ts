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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id/get", getUser);
router.get("/:id/articles/search", searchUserArticles);
router.get("/:id/comments/search", searchUserComments);
router.delete("/:id/delete", deleteUser);

export default router;
