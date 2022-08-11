import mongoose from "mongoose";
import { Request, Response } from "express";

export const getComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const comment = await commentModel.findById(id);
    res.status(200).json({
      commentID: comment._id,
      authorID: comment.AuthorID,
      authorUsername: comment.AuthorUsername,
      commentBody: comment.commentBody,
      articleID: comment.articleID,
      commentReplyCount: comment.commentReplyIDs.length,
      dateCreated: comment.dateCreated,
    });
  } catch (error) {
    res.status(404).json({ message: "Comment not found" });
  }
};
