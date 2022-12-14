import mongoose from "mongoose";
import { Request, Response } from "express";
import { userModel } from "../models/userModels";
import { articleModel } from "../models/articleModels";
import { commentModel } from "../models/commentModels";
import { deleteMongoComment } from "./commentControllers";
import { deleteMongoArticle } from "./articleControllers";
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
    res.status(201).json({ userID: user._id, jwtToken: "token" });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username: username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const encryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");

  if (user.password != encryptedPassword) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.status(200).json({ userID: user._id, jwtToken: "token" });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    userID: user._id,
    username: user.username,
    userArticleCount: user.userArticleIDs.length,
    userCommentCount: user.userCommentIDs.length,
    dateJoined: user.dateJoined,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  await deleteMongoUser(id);

  res.status(200).json({ message: "User successfully deleted" });
};

export const searchUserArticles = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  let limit: any = req.query.limit;
  let skip: any = req.query.skip;

  if (typeof limit != "string") {
    limit = "10";
  }

  if (typeof skip != "string") {
    skip = "0";
  }

  const articles = await articleModel
    .find({
      _id: { $in: user.userArticleIDs },
    })
    .limit(limit)
    .skip(skip);

  let articlesResponse = [];

  for (const article of articles) {
    articlesResponse.push({
      articleID: article._id,
      authorID: article.authorID,
      authorUsername: article.authorUsername,
      articleTitle: article.articleTitle,
      articleBody: article.articleBody,
      articleTags: article.articleTags,
      articleCommentCount: article.articleCommentIDs.length,
      dateCreated: article.dateCreated,
    });
  }

  res.status(200).json(articlesResponse);
};

export const searchUserComments = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  let limit: any = req.query.limit;
  let skip: any = req.query.skip;

  if (typeof limit != "string") {
    limit = "10";
  }

  if (typeof skip != "string") {
    skip = "0";
  }

  const comments = await commentModel
    .find({
      _id: { $in: user.userCommentIDs },
    })
    .limit(limit)
    .skip(skip);

  let commentsResponse = [];

  for (const comment of comments) {
    commentsResponse.push({
      commentID: comment._id,
      authorID: comment.authorID,
      authorUsername: comment.authorUsername,
      commentBody: comment.commentBody,
      articleID: comment.articleID,
      articleTitle: comment.articleTitle,
      dateCreated: comment.dateCreated,
    });
  }

  res.status(200).json(commentsResponse);
};

export async function deleteMongoUser(userID: String) {
  const user = await userModel.findById(userID);

  const userArticleIDs = await articleModel.find({
    _id: { $in: user.userArticleIDs },
  });
  for (const userArticleID of userArticleIDs) {
    await deleteMongoArticle(userArticleID);
  }

  const userCommentIDs = await commentModel.find({
    _id: { $in: user.userCommentIDs },
  });
  for (const userCommentID of userCommentIDs) {
    await deleteMongoComment(userCommentID);
  }

  await userModel.findByIdAndRemove(userID);
}
