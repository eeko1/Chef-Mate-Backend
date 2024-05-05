import express from 'express';
import {
  likeListGet,
  likeListByMediaIdGet,
  likePost,
  likeDelete
} from '../controllers/likeController';
import { authenticate, validationErrors } from '../../middlewares';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @api {get} /likes Get list of all likes
 * @apiName GetLikes
 * @apiGroup Likes
 * @apiDescription Retrieves a list of all likes across all media.
 *
 * @apiSuccess {Object[]} likes List of likes with detailed information.
 * @apiSuccess {Number} likes.id Like ID.
 * @apiSuccess {Number} likes.user_id User ID of the user who liked the media.
 * @apiSuccess {Number} likes.media_id Media ID of the liked media.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 123,
 *         "user_id": 1,
 *         "media_id": 456
 *       }
 *     ]
 */
router.get('/', likeListGet);

/**
 * @api {post} /likes Add a new like
 * @apiName PostLike
 * @apiGroup Likes
 * @apiDescription Adds a new like to a media by an authenticated user.
 *
 * @apiBody {Number} media_id The ID of the media to be liked.
 *
 * @apiPermission Authenticated
 * @apiUse ValidationError
 *
 * @apiSuccess {Object} like The newly created like object.
 * @apiSuccess {Number} like.id Like ID.
 * @apiSuccess {Number} like.user_id User's ID (authenticated user).
 * @apiSuccess {Number} like.media_id Liked media's ID.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation error: 'media_id' must be a non-empty integer."
 *     }
 */
router.post(
  '/',
  authenticate,
  body('media_id').notEmpty().isInt(),
  validationErrors,
  likePost
);

/**
 * @api {get} /likes/bymedia/:media_id Get likes by media ID
 * @apiName GetLikesByMedia
 * @apiGroup Likes
 * @apiDescription Retrieves a list of likes specific to a media ID.
 *
 * @apiParam {Number} media_id The ID of the media whose likes are to be retrieved.
 *
 * @apiSuccess {Object[]} likes List of likes for the specified media.
 * @apiSuccess {Number} likes.id Like ID.
 * @apiSuccess {Number} likes.user_id User ID who liked the media.
 * @apiSuccess {Number} likes.media_id Media ID of the liked media.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 123,
 *         "user_id": 2,
 *         "media_id": 789
 *       }
 *     ]
 */
router.get('/bymedia/:media_id', likeListByMediaIdGet);

/**
 * @api {delete} /likes/:media_id Remove a like
 * @apiName DeleteLike
 * @apiGroup Likes
 * @apiDescription Removes a like from a media by an authenticated user.
 *
 * @apiParam {Number} media_id The ID of the media whose like is to be removed.
 *
 * @apiPermission Authenticated
 *
 * @apiSuccess {String} message Success message indicating the like was deleted.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like successfully removed."
 *     }
 */
router.delete('/:media_id', authenticate, likeDelete);

export default router;
