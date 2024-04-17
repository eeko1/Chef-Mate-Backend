import express from 'express';
import {
  likeListGet,
  likeListByMediaIdGet,
  likePost,
} from '../controllers/likeController';
import {authenticate, validationErrors} from '../../middlewares';
import {body} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(likeListGet)
  .post(
    authenticate,
    body('media_id').notEmpty().isInt(),
    validationErrors,
    likePost
  );

router.route('/bymedia/:media_id').get(likeListByMediaIdGet);

export default router;
