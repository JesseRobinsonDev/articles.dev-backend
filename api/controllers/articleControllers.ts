import mongoose from "mongoose";
import { Request, Response } from "express";
import { articleModel } from "../models/articleModels";
import { userModel } from "../models/userModels";
import { commentModel } from "../models/commentModels";
import { deleteMongoComment } from "./commentControllers";

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
    articleCommentCount: article.articleCommentIDs.length,
    dateCreated: article.dateCreated,
  });
};

export const updateArticle = async (req: Request, res: Response) => {};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No article with id: ${id}`);
  }

  await deleteMongoArticle(id);

  res.status(200).json({ message: "Article successfully deleted" });
};

export const searchArticleComments = async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await articleModel.findById(id);

  if (!article) {
    return res.status(404).send(`No article with id: ${id}`);
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
      _id: { $in: article.articleReplyIDs },
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

export const commentArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body, author } = req.body;

  const user = await userModel.findById(author);

  if (!user) {
    return res.status(404).json({ error: "User not Found" });
  }

  const article = await articleModel.findById(id);

  if (!article) {
    return res.status(404).json({ error: "Article not Found" });
  }

  const comment = new commentModel({
    authorID: user._id,
    authorUsername: user.username,
    commentBody: body,
    articleID: article._id,
    articleTitle: article.articleTitle,
  });

  try {
    await comment.save();
    res.status(201).json(comment);

    article.articleCommentIDs.unshift(comment._id);
    await articleModel.findByIdAndUpdate(article._id, article, { new: true });

    user.userCommentIDs.unshift(comment._id);
    await userModel.findByIdAndUpdate(user._id, user, { new: true });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export async function deleteMongoArticle(articleID: String) {
  const article = await articleModel.findById(articleID);

  const articleCommentIDs = await commentModel.find({
    _id: { $in: article.articleCommentIDs },
  });
  for (const articleCommentID of articleCommentIDs) {
    await deleteMongoComment(articleCommentID);
  }

  const user = await userModel.findById(article.authorID);
  user.userArticleIDs.splice(user.userArticleIDs.indexOf(articleID), 1);
  await userModel.findByIdAndUpdate(user._id, user, { new: true });

  await articleModel.findByIdAndRemove(articleID);
}
