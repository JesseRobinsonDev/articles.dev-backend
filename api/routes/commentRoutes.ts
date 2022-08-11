import express from "express";
import {
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentControllers";

const router = express.Router();

router.get("/:id/get", getComment);
router.put("/:id/update", updateComment);
router.delete("/:id/delete", deleteComment);

export default router;
