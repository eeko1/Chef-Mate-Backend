import { NextFunction } from "express";
import { fetchAllLikes, fetchLikesByMediaId } from "../models/likeModel";
import CustomError from "../../classes/CustomError";
import { Like } from "@sharedTypes/DBTypes";
import { Request, Response } from "express";

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

export { likeListGet, likeListByMediaIdGet };
