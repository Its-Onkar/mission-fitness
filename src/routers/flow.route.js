import { Router } from 'express';
import { completeOnboardingFlow, getUserFlowData, updateFlowStep } from '../controllers/flow.controller.js';
import { authenticateToken } from '../middleware/tokenAuth.js';

const flowRouter = Router();

flowRouter.post('/complete-onboarding', authenticateToken, completeOnboardingFlow);
flowRouter.get('/user-flow-data', authenticateToken, getUserFlowData);
flowRouter.post('/update-step', authenticateToken, updateFlowStep);

export default flowRouter;