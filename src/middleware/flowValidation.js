import { getUserFlowState, FLOW_STATES } from '../services/flow.service.js';
import { FlowStateError, OnboardingIncompleteError, AIPlansRequiredError } from '../utils/flowErrors.js';
import logger from '../utils/logger.js';

/**
 * Validates user's flow state is consistent and not corrupted
 * Checks for data integrity issues
 */
export async function validateFlowState(req, res, next) {
    try {
        if (!req.user) {
            return next();
        }

        const flowState = await getUserFlowState(req.user._id);
        
        // Check for inconsistent state
        if (!flowState || !flowState.currentState) {
            logger.error(`Flow state validation failed for user ${req.user._id}: Invalid state`);
            throw new FlowStateError('User flow state is invalid', req.user._id);
        }

        // Attach validated flow state to request
        req.validatedFlowState = flowState;
        
        logger.debug(`Flow state validated for user ${req.user._id}: ${flowState.currentState}`);
        next();

    } catch (error) {
        logger.error('Flow state validation error:', error);
        next(error);
    }
}

/**
 * Middleware factory to require a specific flow step completion
 * @param {string} requiredStep - Required step ('onboarding' or 'ai_plans')
 * @returns {Function} Express middleware
 */
export function requireFlowStep(requiredStep) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const flowState = await getUserFlowState(req.user._id);

            // Check if required step is complete
            if (requiredStep === 'onboarding' && !flowState.steps.onboardingComplete) {
                logger.warn(`User ${req.user._id} attempted to access resource requiring onboarding`);
                throw new OnboardingIncompleteError('Onboarding must be completed', req.user._id);
            }

            if (requiredStep === 'ai_plans' && !flowState.steps.aiPlansGenerated) {
                logger.warn(`User ${req.user._id} attempted to access resource requiring AI plans`);
                throw new AIPlansRequiredError('AI plans must be generated', req.user._id);
            }

            next();

        } catch (error) {
            logger.error('Flow step requirement check failed:', error);
            
            if (error instanceof OnboardingIncompleteError || error instanceof AIPlansRequiredError) {
                return res.status(403).json({
                    error: error.message,
                    requiredStep: error.requiredStep,
                    redirectTo: error.requiredStep === 'onboarding' ? '/onboarding' : '/ai-plans'
                });
            }

            next(error);
        }
    };
}

/**
 * Middleware to ensure user has completed full flow before accessing protected resources
 */
export async function requireCompleteFlow(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const flowState = await getUserFlowState(req.user._id);

        if (flowState.currentState !== FLOW_STATES.COMPLETE) {
            logger.warn(`User ${req.user._id} attempted to access protected resource with incomplete flow`);
            return res.status(403).json({
                error: 'Complete onboarding flow required',
                currentState: flowState.currentState,
                completionPercentage: flowState.completionPercentage,
                redirectTo: flowState.nextRoute
            });
        }

        next();

    } catch (error) {
        logger.error('Complete flow requirement check failed:', error);
        next(error);
    }
}

export default {
    validateFlowState,
    requireFlowStep,
    requireCompleteFlow
};
