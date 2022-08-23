import express from "express";
import {
  createArticle,
  commentArticle,
  searchArticles,
  getArticle,
  searchArticleComments,
  updateArticle,
  deleteArticle,
} from "../controllers/articleControllers";

const router = express.Router();

router.post("/create", createArticle);
router.get("/search", searchArticles);
router.get("/:id/get", getArticle);
router.put("/:id/update", updateArticle);
router.delete("/:id/delete", deleteArticle);
router.post("/:id/comment", commentArticle);
router.get("/:id/comments/search", searchArticleComments);

export default router;
