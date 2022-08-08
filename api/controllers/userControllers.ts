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

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username: username });
  const encryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.password != encryptedPassword) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  res.status(200).json(user);
};
