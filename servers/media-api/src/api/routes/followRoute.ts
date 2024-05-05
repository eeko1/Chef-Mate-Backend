import express from "express";
import {
  followListGet,
  followUser,
  followDelete,
  followCountGetById,
  getFollowByUser,
  followingCountGetById
} from "../controllers/followController";
import { authenticate, validationErrors } from "../../middlewares";
import { body } from "express-validator";

const router = express.Router();

/**
 * @apiDefine ValidationError
 * @apiError ValidationError The input data is invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation error: followed_id must be a number."
 *     }
 */

/**
 * @api {get} /follows Get all follows
 * @apiName GetFollows
 * @apiGroup Follows
 * @apiDescription Retrieves a list of all follows.
 *
 * @apiSuccess {Object[]} follows List of follows with detailed information.
 * @apiSuccess {Number} follows.id Follow ID.
 * @apiSuccess {Number} follows.follower_id Follower's user ID.
 * @apiSuccess {Number} follows.followed_id Followed user's ID.
 * @apiSuccess {String} follows.created_at Timestamp when the follow was created.
 * @apiSuccess {String} follows.updated_at Timestamp when the follow was last updated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "follower_id": 1,
 *         "followed_id": 2,
 *         "created_at": "2021-01-01T00:00:00.000Z",
 *         "updated_at": "2021-01-01T00:00:00.000Z"
 *       }
 *     ]
 */
router.get("/", followListGet);

/**
 * @api {post} /follows Create a follow
 * @apiName FollowUser
 * @apiGroup Follows
 * @apiDescription Create a follow relationship between the authenticated user and another user.
 *
 * @apiBody {Number} followed_id The ID of the user to be followed.
 *
 * @apiPermission Authenticated
 * @apiUse ValidationError
 *
 * @apiSuccess {Object} follow The newly created follow object.
 * @apiSuccess {Number} follow.id Follow ID.
 * @apiSuccess {Number} follow.follower_id Follower's user ID (authenticated user's ID).
 * @apiSuccess {Number} follow.followed_id Followed user's ID.
 * @apiSuccess {String} follow.created_at Timestamp when the follow was created.
 */
router.post(
  "/",
  authenticate,
  body("followed_id").isNumeric(),
  validationErrors,
  followUser
);

/**
 * @api {delete} /follows/:followed_id Delete a follow
 * @apiName UnfollowUser
 * @apiGroup Follows
 * @apiDescription Delete a follow relationship between the authenticated user and another user.
 *
 * @apiParam {Number} followed_id The ID of the user to unfollow.
 *
 * @apiPermission Authenticated
 *
 * @apiSuccess {String} message Success message indicating the follow was deleted.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Follow relationship deleted successfully."
 *     }
 */
router.delete("/:followed_id", authenticate, followDelete);

/**
 * @api {get} /follows/count/user/:followed_id Get follow count
 * @apiName GetFollowCount
 * @apiGroup Follows
 * @apiDescription Get the number of followers for a specific user.
 *
 * @apiParam {Number} followed_id The ID of the user whose followers count is to be retrieved (URL parameter).
 *
 * @apiSuccess {Number} count Number of followers.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "count": 150
 *     }
 */
router.get("/count/user/:followed_id", authenticate, followCountGetById);

/**
 * @api {get} /follows/count/following/:follower_id Get following count
 * @apiName GetFollowingCount
 * @apiGroup Follows
 * @apiDescription Get the count of how many users a specific user is following.
 *
 * @apiParam {Number} follower_id The ID of the user whose following count is to be retrieved (URL parameter).
 *
 * @apiSuccess {Number} count Number of users being followed.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "count": 75
 *     }
 */
router.get("/count/following/:follower_id", authenticate, followingCountGetById);

export default router;
