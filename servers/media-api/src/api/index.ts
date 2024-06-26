import express, {Request, Response} from 'express';

import mediaRoute from './routes/mediaRoute';
import tagRoute from './routes/tagRoute';
import likeRoute from './routes/likeRoute';
import ratingRoute from './routes/ratingRoute';
import followRoute from './routes/followRoute';
import commentRoute from './routes/commentRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/media', mediaRoute);
router.use('/tags', tagRoute);
router.use('/likes', likeRoute);
router.use('/ratings', ratingRoute);
router.use('/follows', followRoute);
router.use('/comments', commentRoute);

export default router;
