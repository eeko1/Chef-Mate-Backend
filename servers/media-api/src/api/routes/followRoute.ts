import express from "express";
import { followListGet, followUser, followDelete, followCountGetById, getFollowByUser } from "../controllers/followController";
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
router
  .route("/:followed_id")
  .delete(
    authenticate,
    followDelete
  )


export default router;
