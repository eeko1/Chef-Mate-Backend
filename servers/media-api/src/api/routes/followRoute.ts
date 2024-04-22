import express from "express";
import { followListGet, followUser, followDelete } from "../controllers/followController";
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

router
  .route("/:followed_id")
  .delete(
    authenticate,
    followDelete
  )

export default router;
