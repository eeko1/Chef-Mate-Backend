import express from 'express';
import {
  ratingListGet,
  ratingListByMediaIdGet,
  ratingAverageByMediaIdGet,
} from '../controllers/ratingController';

const router = express.Router();

router.route('/bymedia/:id').get(ratingListByMediaIdGet);
router.route('/average/:id').get(ratingAverageByMediaIdGet);

export default router;
