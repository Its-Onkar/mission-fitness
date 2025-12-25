import { Router } from 'express';
import { saveDailyProgress, getDailyProgress, getProgressHistory } from '../controllers/progress.controller.js';
import { authenticateToken } from '../middleware/tokenAuth.js';

const progressRouter = Router();

progressRouter.post('/daily', authenticateToken, saveDailyProgress);
progressRouter.get('/daily', authenticateToken, getDailyProgress);
progressRouter.get('/history', authenticateToken, getProgressHistory);

export default progressRouter;