import mongoose from "mongoose";
import { Request, Response } from "express";
import { userModel } from "../models/userModels";
import { articleModel } from "../models/articleModels";
import { commentModel } from "../models/commentModels";

export const getComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const comment = await commentModel.findById(id);
    res.status(200).json({
      commentID: comment._id,
      authorID: comment.authorID,
      authorUsername: comment.authorUsername,
      commentBody: comment.commentBody,
      articleID: comment.articleID,
      articleTitle: comment.articleTitle,
      dateCreated: comment.dateCreated,
    });
  } catch (error) {
    res.status(404).json({ message: "Comment not found" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No comment with id ${id}`);
  }

  const updatedComment = await commentModel.findByIdAndUpdate(
    id,
    { commentBody: body },
    {
      new: true,
    }
  );

  res.status(200).json(updatedComment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No comment with id: ${id}`);
  }

  await deleteMongoComment(id);

  res.status(200).json({ message: "Comment successfully deleted" });
};

export async function deleteMongoComment(commentID: String) {
  const comment = await commentModel.findById(commentID);

  const article = await articleModel.findById(comment.articleID);
  article.articleCommentIDs.splice(
    article.articleCommentIDs.indexOf(commentID),
    1
  );
  await articleModel.findByIdAndUpdate(article._id, article, { new: true });

  const user = await userModel.findById(comment.authorID);
  user.userCommentIDs.splice(user.userCommentIDs.indexOf(commentID), 1);
  await userModel.findByIdAndUpdate(user._id, user, { new: true });

  await commentModel.findByIdAndRemove(commentID);
}
