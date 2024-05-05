import {Request, Response, NextFunction} from 'express';
import {
  fetchAllComments,
  fetchCommentsByMediaId,
  fetchCommentsCountByMediaId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  updateComment,
  deleteComment,
} from '../models/commentModel';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {Comment, TokenContent} from '@sharedTypes/DBTypes';


/**
 * @api {get} /comments Request all comments
 * @apiName GetComments
 * @apiGroup Comments
 *
 * @apiSuccess {Object[]} comments List of comments.
 * @apiSuccess {Number} comments.id Comment id.
 * @apiSuccess {String} comments.comment_text Comment text.
 * @apiSuccess {Number} comments.media_id Media id associated with the comment.
 * @apiSuccess {Number} comments.user_id User id who posted the comment.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "comment_text": "This is a comment",
 *         "media_id": 1,
 *         "user_id": 1
 *       }
 *     ]
 *
 * @apiError NoCommentsFound No comments were found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "NoCommentsFound"
 *     }
 */
// GET ALL COMMENTS
const commentListGet = async (
  req: Request,
  res: Response<Comment[]>,
  next: NextFunction
) => {
  try {
    const comments = await fetchAllComments();
    if (comments) {
      res.json(comments);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

// GET COMMENTS BY MEDIA ID
const commentListByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<Comment[]>,
  next: NextFunction
) => {
  try {
    const comments = await fetchCommentsByMediaId(Number(req.params.id));
    if (comments) {
      res.json(comments);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

// GET COMMENTS BY USER ID
const commentListByUserGet = async (
  req: Request,
  res: Response<Comment[], {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const comments = await fetchCommentsByUserId(
      Number(res.locals.user.user_id)
    );
    if (comments) {
      res.json(comments);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

// GET COMMENT COUNT BY MEDIA ID
const commentCountByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction
) => {
  try {
    const count = await fetchCommentsCountByMediaId(Number(req.params.id));
    if (count) {
      res.json({count});
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

// GET COMMENT BY COMMENT ID
const commentGet = async (
  req: Request<{id: string}>,
  res: Response<Comment>,
  next: NextFunction
) => {
  try {
    const comment = await fetchCommentById(Number(req.params.id));
    if (comment) {
      res.json(comment);
      return;
    }
    next(new CustomError('Comment not found', 404));
  } catch (error) {
    next(error);
  }
};

// POST COMMENT
const commentPost = async (
  req: Request<{}, {}, {comment_text: string; media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await postComment(
      Number(req.body.media_id),
      res.locals.user.user_id,
      req.body.comment_text
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Comment not created', 500));
  } catch (error) {
    next(error);
  }
};

// UPDATE COMMENT
const commentPut = async (
  req: Request<{id: string}, {}, {comment_text: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await updateComment(
      req.body.comment_text,
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Comment not updated', 500));
  } catch (error) {
    next(error);
  }
};

// DELETE COMMENT
const commentDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const result = await deleteComment(
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Comment not deleted', 500));
  } catch (error) {
    next(error);
  }
};

export {
  commentListGet,
  commentListByMediaIdGet,
  commentListByUserGet,
  commentCountByMediaIdGet,
  commentGet,
  commentPost,
  commentPut,
  commentDelete,
};
