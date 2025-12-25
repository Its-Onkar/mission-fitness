import User from '../Schema/user.schema.js';
import { getUserFlowState, getPersonalizedWelcomeMessage, getRecommendedActions } from '../services/flow.service.js';

export const completeOnboardingFlow = async (req, res) => {
    try {
        const userId = req.user._id;
        
        await User.findByIdAndUpdate(userId, { 
            onboardingCompleted: true 
        });
        
        res.status(200).json({
            success: true,
            message: 'Onboarding flow completed successfully',
            redirectUrl: '/main-dashboard'
        });
    } catch (error) {
        console.error('Error completing onboarding flow:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete onboarding flow'
        });
    }
};

export const getUserFlowData = async (req, res) => {
    try {
        const userId = req.user._id;
        const flowState = await getUserFlowState(userId);
        const welcomeMessage = getPersonalizedWelcomeMessage(flowState, req.user.userName);
        const recommendedActions = getRecommendedActions(flowState);
        
        res.status(200).json({
            success: true,
            flowState,
            welcomeMessage,
            recommendedActions
        });
    } catch (error) {
        console.error('Error getting user flow data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user flow data'
        });
    }
};

export const updateFlowStep = async (req, res) => {
    try {
        const userId = req.user._id;
        const { step } = req.body;
        
        const { markFlowStepComplete } = await import('../services/flow.service.js');
        await markFlowStepComplete(userId, step);
        
        const updatedFlowState = await getUserFlowState(userId);
        
        res.status(200).json({
            success: true,
            message: `Flow step '${step}' completed successfully`,
            flowState: updatedFlowState
        });
    } catch (error) {
        console.error('Error updating flow step:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update flow step'
        });
    }
};