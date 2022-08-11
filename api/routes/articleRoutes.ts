import express from "express";
import {
  createArticle,
  commentArticle,
  searchArticles,
  getArticle,
  searchArticleComments,
} from "../controllers/articleControllers";

const router = express.Router();

router.post("/create", createArticle);
router.post("/:id/comment", commentArticle);
router.get("/search", searchArticles);
router.get("/:id/get", getArticle);
router.get("/:id/comments/search", searchArticleComments);

export default router;
