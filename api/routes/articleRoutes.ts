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
router.post("/:id/comment", commentArticle);
router.get("/search", searchArticles);
router.get("/:id/get", getArticle);
router.get("/:id/comments/search", searchArticleComments);
router.put("/:id/update", updateArticle);
router.delete("/:id/delete", deleteArticle);

export default router;
