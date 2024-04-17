import express from 'express';
import {
  likeListGet,
  likeListByMediaIdGet,
  likePost,
  likeDelete
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

router
  .route('/:media_id')
  .delete(authenticate, likeDelete);

export default router;
