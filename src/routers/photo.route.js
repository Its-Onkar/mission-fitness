import { Router } from 'express';
import { uploadPhoto, analyzeWorkoutPhoto, getUserPhotos } from '../controllers/photo.controller.js';
import { authenticateToken } from '../middleware/tokenAuth.js';

const photoRouter = Router();

photoRouter.post('/analyze', authenticateToken, uploadPhoto, analyzeWorkoutPhoto);
photoRouter.get('/user', authenticateToken, getUserPhotos);

export default photoRouter;