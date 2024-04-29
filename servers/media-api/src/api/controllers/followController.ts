import {NextFunction} from 'express';
import {
  fetchAllFollow,
  postUserFollow,
  deleteUserFollow,
  getFollowerCountByFollowedId,
  getUserFollow,
  getFollowingCountByFollowerId,
} from '../models/followModel';
import CustomError from '../../classes/CustomError';
import {UserFollow, TokenContent} from '@sharedTypes/DBTypes';
import {Request, Response} from 'express';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// list all follows
const followListGet = async (
  req: Request,
  res: Response<UserFollow[]>,
  next: NextFunction
) => {
  try {
    const follows = await fetchAllFollow();
    if (follows) {
      res.json(follows);
      return;
    }
    next(new CustomError('No follow found', 404));
  } catch (error) {
    next(error);
  }
};

// follow user/post user follow

const followUser = async (
  req: Request<{}, {}, {followed_id: number}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    console.log('followUser', req.body.followed_id, res.locals.user.user_id);
    const result = await postUserFollow(
      req.body.followed_id,
      res.locals.user.user_id
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
  req: Request,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const followed_id = Number(req.params.followed_id);
    const result = await deleteUserFollow(
      followed_id,
      res.locals.user.user_id
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Follow not found', 500));
  } catch (error) {
    next(error);
  }
};

const followCountGetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const followed_id = Number(req.params.followed_id);
    const count = await getFollowerCountByFollowedId(followed_id);
    if (count) {
      res.json(count);
      return;
    }
    next(new CustomError('No follow found', 404));
  } catch (error) {
    next(error);
  }
};

const followingCountGetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const follower_id = Number(req.params.follower_id);
    const count = await getFollowingCountByFollowerId(follower_id);
    if (count) {
      res.json(count);
      return;
    }
    next(new CustomError('No follow found', 404));
  } catch (error) {
    next(error);
  }
};

const getFollowByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const followed_id = Number(req.params.followed_id);
    const follower_id = res.locals.user.user_id;
    console.log('getFollowByUser', follower_id, followed_id);
    const follows = await getUserFollow(follower_id, followed_id);
    if (follows !== null) {
      console.log('follows', follows);
      res.json(follows);
      return;
    } else {
      return null;
    }
  } catch (error) {
    next(new CustomError('No follow found', 404));
  }
}


export {followListGet, followUser, followDelete, followCountGetById, getFollowByUser, followingCountGetById};
