import express from 'express';
import {
  commentListGet,
  commentListByMediaIdGet,
  commentListByUserGet,
  commentCountByMediaIdGet,
  commentGet,
  commentPost,
  commentPut,
  commentDelete,
} from '../controllers/commentController';
import {authenticate, validationErrors} from '../../middlewares';
import {body} from 'express-validator';

const router = express.Router();

/**
 * @api {get} /comments Get all comments
 * @apiName GetComments
 * @apiGroup Comments
 *
 * @apiSuccess {Object[]} comments List of comments
 * @apiSuccess {Number} comments.id Comment id
 * @apiSuccess {String} comments.comment_text Comment text
 * @apiSuccess {Number} comments.media_id Media id
 * @apiSuccess {Number} comments.user_id User id
 * @apiSuccess {String} comments.created_at Comment creation date
 * @apiSuccess {String} comments.updated_at Comment update date
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "id": 1,
 *   "comment_text": "This is a comment",
 *   "media_id": 1,
 *   "user_id": 1,
 *   "created_at": "2021-01-01T00:00:00.000Z",
 *   "updated_at": "2021-01-01T00:00:00.000Z"
 * }
 * ]
 */

router
  .route('/')
  .get(commentListGet)
  .post(
    authenticate,
    body('comment_text').notEmpty().isString().escape(),
    body('media_id').notEmpty().isInt(),
    validationErrors,
    commentPost
  );

/**
 * @api {get} /comments/bymedia/:id Get comments by media id
 * @apiName GetCommentsByMedia
 * @apiGroup Comments
 *
 * @apiParam {Number} id Media's unique ID.
 *
 * @apiSuccess {Object[]} comments List of comments filtered by media id.
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "id": 2,
 *   "comment_text": "Another comment",
 *   "media_id": 1,
 *   "user_id": 2,
 *   "created_at": "2021-01-02T00:00:00.000Z",
 *   "updated_at": "2021-01-02T00:00:00.000Z"
 * }
 * ]
 */
router.route('/bymedia/:id').get(commentListByMediaIdGet);

/**
 * @api {get} /comments/byuser Get user's comments
 * @apiName GetCommentsByUser
 * @apiGroup Comments
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiSuccess {Object[]} comments List of comments made by the logged-in user.
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "id": 3,
 *   "comment_text": "User's comment",
 *   "media_id": 2,
 *   "user_id": 1,
 *   "created_at": "2021-01-03T00:00:00.000Z",
 *   "updated_at": "2021-01-03T00:00:00.000Z"
 * }
 * ]
 */
router.route('/byuser').get(authenticate, commentListByUserGet);

/**
 * @api {get} /comments/count/:id Get count of comments by media id
 * @apiName GetCommentCountByMedia
 * @apiGroup Comments
 *
 * @apiParam {Number} id Media's unique ID.
 *
 * @apiSuccess {Number} count Number of comments for the specified media.
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   "count": 4
 * }
 */
router.route('/count/:id').get(commentCountByMediaIdGet);

/**
 * @api {get} /comments/:id Get a specific comment
 * @apiName GetComment
 * @apiGroup Comments
 *
 * @apiParam {Number} id Comment's unique ID.
 *
 * @apiSuccess {Object} comment Specific comment details.
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "id": 5,
 *  "comment_text": "Specific comment",
 *  "media_id": 3,
 *  "user_id": 1,
 *  "created_at": "2021-01-05T00:00:00.000Z",
 *  "updated_at": "2021-01-05T00:00:00.000Z"
 * }
 */
router
  .route('/:id')
  .get(commentGet)
  .put(
    authenticate,
    body('comment_text').notEmpty().isString().escape(),
    validationErrors,
    commentPut
  )
  .delete(authenticate, commentDelete);

export default router;
