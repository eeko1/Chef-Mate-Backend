import express from 'express';
import {
  ratingListGet,
  ratingListByMediaIdGet,
  ratingListByUserGet,
  ratingPost,
  ratingDelete,
  ratingAverageByMediaIdGet,
} from '../controllers/ratingController';
import { authenticate } from '../../middlewares';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @api {get} /ratings Get all ratings
 * @apiName GetRatings
 * @apiGroup Ratings
 * @apiDescription Retrieves a list of all ratings.
 *
 * @apiSuccess {Object[]} ratings List of all ratings.
 * @apiSuccess {Number} ratings.id Rating ID.
 * @apiSuccess {Number} ratings.user_id User who gave the rating.
 * @apiSuccess {Number} ratings.media_id Media that was rated.
 * @apiSuccess {Number} ratings.rating_value Rating value given.
 */
router.get('/', ratingListGet);

/**
 * @api {post} /ratings Add a new rating
 * @apiName PostRating
 * @apiGroup Ratings
 * @apiPermission Authenticated
 * @apiDescription Adds a new rating for a media.
 *
 * @apiBody {Number} rating_value Value of the rating (1-5).
 * @apiBody {Number} media_id ID of the media being rated.
 *
 * @apiSuccess {Object} rating Newly created rating details.
 * @apiSuccess {Number} rating.id Rating ID.
 * @apiSuccess {Number} rating.user_id User who gave the rating.
 * @apiSuccess {Number} rating.media_id Media that was rated.
 */
router.post(
  '/',
  authenticate,
  body('rating_value').notEmpty().isInt({ min: 1, max: 5 }),
  body('media_id').notEmpty().isNumeric(),
  ratingPost
);

/**
 * @api {get} /ratings/bymedia/:id Get ratings by media ID
 * @apiName GetRatingsByMedia
 * @apiGroup Ratings
 * @apiDescription Retrieves ratings for a specific media.
 *
 * @apiParam {Number} id Media ID to retrieve ratings for.
 *
 * @apiSuccess {Object[]} ratings List of ratings for the media.
 */
router.get('/bymedia/:id', ratingListByMediaIdGet);

/**
 * @api {get} /ratings/byuser Get ratings by user
 * @apiName GetRatingsByUser
 * @apiGroup Ratings
 * @apiPermission Authenticated
 * @apiDescription Retrieves all ratings made by the authenticated user.
 *
 * @apiSuccess {Object[]} ratings List of ratings made by the user.
 */
router.get('/byuser', authenticate, ratingListByUserGet);

/**
 * @api {get} /ratings/average/:id Get average rating for a media
 * @apiName GetAverageRating
 * @apiGroup Ratings
 * @apiDescription Calculates and retrieves the average rating for a specified media.
 *
 * @apiParam {Number} id Media ID to calculate average rating for.
 *
 * @apiSuccess {Number} average_rating The average rating for the media.
 */
router.get('/average/:id', ratingAverageByMediaIdGet);

/**
 * @api {delete} /ratings/:id Delete a rating
 * @apiName DeleteRating
 * @apiGroup Ratings
 * @apiPermission Authenticated
 * @apiDescription Deletes a specific rating by ID.
 *
 * @apiParam {Number} id Rating ID to be deleted.
 *
 * @apiSuccess {String} message Success message confirming deletion.
 */
router.delete('/:id', authenticate, ratingDelete);

export default router;
