import { createDietPlan } from "../services/diet.services.js";
import { createFitness } from "../services/fitness.service.js";
import { markOnboardingComplete } from "../services/user.services.js";
import { createWorkoutPlan } from "../services/workoutPlan.service.js";
import { getFitnessResponse } from "../utils/prompt.utils.js";
import User from "../Schema/user.schema.js";
import logger from "../utils/logger.js";


export const getOnboardingDataController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error("User ID not provided");
        const onboardingData = await getOnboardingDataByUserId(userId);
        res.status(200).json(onboardingData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createOnboardingController = async (req, res) => {
    const startTime = Date.now();
    
    try {
        const onboardingData = req.body;
        const userData = req.auth;
        
        logger.info(`Creating onboarding for user: ${userData._id}`);
        logger.debug('Onboarding data received:', onboardingData);
        
        // Validate required fields for fitness profile
        if (!onboardingData.gender || !onboardingData.age || !onboardingData.heightCm || !onboardingData.weightKg) {
            logger.warn(`Onboarding validation failed for user ${userData._id}: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields: gender, age, heightCm, weightKg' });
        }
        
        // Validate enum values for fitness profile
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(onboardingData.gender)) {
            logger.warn(`Onboarding validation failed for user ${userData._id}: Invalid gender value`);
            return res.status(400).json({ message: 'Invalid gender value' });
        }
        
        const validGoals = ['weight loss', 'muscle gain', 'maintenance', 'balanced', 'weight gain'];
        if (onboardingData.goal && !validGoals.includes(onboardingData.goal)) {
            logger.warn(`Onboarding validation failed for user ${userData._id}: Invalid goal value`);
            return res.status(400).json({ message: 'Invalid goal value' });
        }
        
        // Create fitness profile
        logger.info(`Creating fitness profile for user ${userData._id}`);
        const fitnessResult = await createFitness(onboardingData, userData);
        const fitnessProfile = fitnessResult.fitnessProfile;
        
        // Generate AI fitness plan
        const aiPlanData = {
            ...(fitnessProfile.toObject ? fitnessProfile.toObject() : fitnessProfile),
            userId: userData._id
        };
        
        let aiResponse = null;
        try {
            logger.info(`Generating AI response for user ${userData._id}`);
            aiResponse = await getFitnessResponse(
                aiPlanData, 
                `Create a personalized fitness plan based on my profile. Include weekly workout schedule and nutrition tips.`
            );
            logger.info(`AI response generated successfully for user ${userData._id}`);
        } catch (aiError) {
            logger.error(`AI generation failed for user ${userData._id}:`, aiError.message);
            // Continue without AI plan if it fails
        }
        
        // Create traditional plans with diet preference validation
        logger.debug(`Diet preference from onboarding: ${onboardingData.dietPreference}`);
        logger.debug(`Diet preference in fitness profile: ${fitnessProfile.dietPreference}`);
        
        logger.info(`Creating diet and workout plans for user ${userData._id}`);
        const dietPlanResult = await createDietPlan(fitnessProfile, userData);
        const workoutPlanResult = await createWorkoutPlan(fitnessProfile, userData);
        logger.debug(`Plans created for user ${userData._id}:`, { 
            dietPlan: !!dietPlanResult, 
            workoutPlan: !!workoutPlanResult 
        });
        
        // Extract AI-generated plans from the services
        const aiWorkoutPlan = workoutPlanResult.aiPlan || null;
        const aiDietPlan = dietPlanResult.aiPlan || null;
        
        // Use flow service to mark onboarding complete
        logger.info(`Marking onboarding complete for user ${userData._id}`);
        const { markFlowStepComplete } = await import('../services/flow.service.js');
        
        // Mark onboarding step complete (this updates Onboarding.isComplete)
        await markFlowStepComplete(userData._id, 'onboarding');
        
        // Mark AI plans step complete (this updates User.onboardingCompleted)
        await markFlowStepComplete(userData._id, 'ai_plans');
        
        const duration = Date.now() - startTime;
        logger.info(`Onboarding completed successfully for user ${userData._id} (${duration}ms)`);

        res.status(201).json({
            message: "Fitness profile created, AI-powered plan generated",
            fitnessProfile: fitnessProfile,
            aiPlan: aiResponse,
            plan: {
                workoutPlan: aiWorkoutPlan,
                dietPlan: aiDietPlan
            },
            workoutPlan: aiWorkoutPlan,
            dietPlan: aiDietPlan,
            // Also include the database objects for reference
            dbWorkoutPlan: workoutPlanResult.dbPlan,
            dbDietPlan: dietPlanResult.dbPlan
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`Onboarding error for user ${req.auth?._id} (${duration}ms):`, {
            error: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // More specific error messages
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided: ' + error.message });
        }
        if (error.message.includes('OpenAI') || error.message.includes('AI')) {
            return res.status(503).json({ message: 'AI service temporarily unavailable. Please try again.' });
        }
        if (error.message.includes('Token') || error.message.includes('authorization')) {
            return res.status(401).json({ message: 'Authentication failed. Please log in again.' });
        }
        
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export const updateOnboardingController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error("User ID not provided");
        const updateData = req.body;
        const updatedOnboardingData = await updateOnboardingData(userId, updateData);
        res.status(200).json(updatedOnboardingData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// New endpoint for AI recommendations during onboarding
export const getAIRecommendations = async (req, res) => {
    try {
        const { step, formData } = req.body;
        const userData = req.auth;
        
        let prompt = '';
        
        switch(step) {
            case 'goal':
                prompt = `Based on my profile, suggest the best fitness goal and explain why.`;
                break;
            case 'workout':
                prompt = `Recommend workout preferences based on my fitness level and goals.`;
                break;
            case 'nutrition':
                prompt = `Suggest the best diet approach for my fitness goals and preferences.`;
                break;
            default:
                prompt = `Provide personalized fitness advice based on my current profile.`;
        }
        
        const aiData = {
            ...formData,
            userId: userData._id,
            points: 0,
            plan: null
        };
        
        const aiResponse = await getFitnessResponse(aiData, prompt);
        
        res.status(200).json({
            recommendations: aiResponse,
            step: step
        });
        
    } catch (error) {
        console.error('AI recommendation error:', error);
        res.status(500).json({ message: 'Failed to get AI recommendations' });
    }
}



