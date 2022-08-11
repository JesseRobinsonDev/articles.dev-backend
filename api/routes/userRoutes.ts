import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id/get", getUser);

export default router;
