import mongoose from "mongoose";
import { Request, Response } from "express";
import { articleModel } from "../models/articleModels";
import { userModel } from "../models/userModels";

export const createArticle = async (req: Request, res: Response) => {
  const { author, title, body, tags } = req.body;

  const user = await userModel.findById(author);

  if (!user) {
    return res.status(404).json({ error: "User not Found" });
  }

  const article = new articleModel({
    articleTitle: title,
    articleBody: body,
    authorID: author,
    authorUsername: user.username,
    articleTags: tags,
  });

  try {
    await article.save();
    res.status(201).json(article);

    user.userArticleIDs.unshift(article._id);
    await userModel.findByIdAndUpdate(user._id, user, { new: true });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const searchArticles = async (req: Request, res: Response) => {
  let limit: any = req.query.limit;
  let skip: any = req.query.skip;

  if (typeof limit != "string") {
    limit = "10";
  }

  if (typeof skip != "string") {
    skip = "0";
  }

  const articles = await articleModel
    .find()
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  let articleResponses = [];

  for (const article of articles) {
    articleResponses.push({
      articleID: article._id,
      authorID: article.authorID,
      authorUsername: article.authorUsername,
      articleTitle: article.articleTitle,
      articleTags: article.articleTags,
      articleCommentCount: article.articleCommentIDs.length,
      dateCreated: article.dateCreated,
    });
  }

  res.status(200).json(articleResponses);
};

export const getArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await articleModel.findById(id);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.status(200).json({
    articleID: article,
    authorID: article.authorID,
    authorUsername: article.authorUsername,
    articleTitle: article.title,
    articleBody: article.body,
    articleTags: article.tags,
    dateCreated: article.dateCreated,
  });
};
