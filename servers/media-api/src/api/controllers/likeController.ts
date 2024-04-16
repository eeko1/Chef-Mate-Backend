import { NextFunction } from "express";
import { fetchAllLikes, fetchLikesByMediaId, postLike } from "../models/likeModel";
import CustomError from "../../classes/CustomError";
import { Like, TokenContent } from "@sharedTypes/DBTypes";
import { Request, Response } from "express";
import { MessageResponse } from "@sharedTypes/MessageTypes";

// LIST ALL LIKES
const likeListGet = async (req: Request, res: Response<Like[]>, next: NextFunction) => {
  try {
    const likes = await fetchAllLikes();
    if (likes) {
      res.json(likes);
      return;
    }
    next (new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

// LIST LIKES BY MEDIA ID
const likeListByMediaIdGet = async (
  req: Request<{media_id: string}>,
  res: Response<Like[]>,
  next: NextFunction
) => {
  try {
    const likes = await fetchLikesByMediaId(Number(req.params.media_id));
    if (likes) {
      res.json(likes);
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

// POST LIKE
const likePost = async (
  req: Request<{}, {}, {media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await postLike(
      Number(req.body.media_id),
      res.locals.user.user_id
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Like not created', 500));
  } catch (error) {
    next(error);
  }
};

export { likeListGet, likeListByMediaIdGet, likePost };
