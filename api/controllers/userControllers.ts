import mongoose from "mongoose";
import { Request, Response } from "express";
import { userModel } from "../models/userModels";
import crypto from "crypto";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const encryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  const user = new userModel({
    username,
    password: encryptedPassword,
  });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};
