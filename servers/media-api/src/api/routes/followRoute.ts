import express from "express";
import { followListGet, followUser, followDelete, followCountGetById, getFollowByUser, followingCountGetById } from "../controllers/followController";
import { authenticate, validationErrors } from "../../middlewares";
import { body } from "express-validator";

const router = express.Router();

router
  .route("/")
  .get(followListGet)
  .post(
    authenticate,
    body("followed_id").isNumeric(),
    validationErrors,
    followUser
  )

  router.get("/count/user/:followed_id",
  authenticate, getFollowByUser);
  router.get("/count/:followed_id", followCountGetById);
  router.get("/count/following/:follower_id", followingCountGetById);
router
  .route("/:followed_id")
  .delete(
    authenticate,
    followDelete
  )


export default router;
