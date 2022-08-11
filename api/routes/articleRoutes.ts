import express from "express";
import {
  createArticle,
  searchArticles,
  getArticle,
} from "../controllers/articleControllers";

const router = express.Router();

router.post("/create", createArticle);
router.get("/search", searchArticles);
router.get("/:id/get", getArticle);

export default router;
