import express, {Request, Response} from 'express';

import mediaRoute from './routes/mediaRoute';
import tagRoute from './routes/tagRoute';
import followRoute from './routes/followRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/media', mediaRoute);
router.use('/tags', tagRoute);
router.use('/follows', followRoute);

export default router;
