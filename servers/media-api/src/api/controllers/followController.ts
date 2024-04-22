import { NextFunction } from "express";
import { fetchAllFollow, postUserFollow, deleteUserFollow } from "../models/followModel";
import CustomError from "../../classes/CustomError"
import { UserFollow, TokenContent } from "@sharedTypes/DBTypes";
import { Request, Response } from "express";
import { MessageResponse } from "@sharedTypes/MessageTypes";

// list all follows
const followListGet = async (req: Request, res : Response<UserFollow[]>, next: NextFunction) => {
  try {
    const follows = await fetchAllFollow();
    if (follows) {
      res.json(follows);
      return;
    }
    next (new CustomError('No follow§ found', 404));
  } catch (error) {
    next(error);
  }
};

// follow user/post user follow

const followUser = async (
  req: Request<{}, {}, { followed_id: number }>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await postUserFollow(
      Number(req.body.followed_id),
      Number(req.body.followed_id),
      res.locals.user.user_id,
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Follow already exists', 500));
  } catch (error) {
    next(error);
  }
};

// delete user follow
const followDelete = async (
  req: Request<{}, {}, { followed_id: number }>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await deleteUserFollow(
      Number(req.body.followed_id),
      Number(req.body.followed_id),
      res.locals.user.user_id,
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Follow not found', 500));
  } catch (error) {
    next(error);
  }
}

export { followListGet, followUser, followDelete };
