import { createDietPlan } from "../services/diet.services.js";
import { createFitness } from "../services/fitness.service.js";
import { markOnboardingComplete } from "../services/user.services.js";
import { createWorkoutPlan } from "../services/workoutPlan.service.js";
import { getFitnessResponse } from "../utils/prompt.utils.js";
import User from "../Schema/user.schema.js";


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
    try {
        const onboardingData = req.body;
        const userData = req.auth;
        
        console.log('Creating onboarding for user:', userData._id);
        console.log('Onboarding data received:', onboardingData);
        
        // Validate required fields for fitness profile
        if (!onboardingData.gender || !onboardingData.age || !onboardingData.heightCm || !onboardingData.weightKg) {
            return res.status(400).json({ message: 'Missing required fields: gender, age, heightCm, weightKg' });
        }
        
        // Validate enum values for fitness profile
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(onboardingData.gender)) {
            return res.status(400).json({ message: 'Invalid gender value' });
        }
        
        const validGoals = ['weight loss', 'muscle gain', 'maintenance', 'balanced', 'weight gain'];
        if (onboardingData.goal && !validGoals.includes(onboardingData.goal)) {
            return res.status(400).json({ message: 'Invalid goal value' });
        }
        
        // Create fitness profile
        const fitnessResult = await createFitness(onboardingData, userData);
        const fitnessProfile = fitnessResult.fitnessProfile;
        
        // Generate AI fitness plan
        const aiPlanData = {
            ...(fitnessProfile.toObject ? fitnessProfile.toObject() : fitnessProfile),
            userId: userData._id
        };
        
        let aiResponse = null;
        try {
            console.log('Generating AI response...');
            aiResponse = await getFitnessResponse(
                aiPlanData, 
                `Create a personalized fitness plan based on my profile. Include weekly workout schedule and nutrition tips.`
            );
            console.log('AI response generated successfully');
        } catch (aiError) {
            console.error('AI generation failed:', aiError.message);
            // Continue without AI plan if it fails
        }
        
        // Create traditional plans with diet preference validation
        console.log('Diet preference from onboarding:', onboardingData.dietPreference);
        console.log('Diet preference in fitness profile:', fitnessProfile.dietPreference);
        
        const dietPlanResult = await createDietPlan(fitnessProfile, userData);
        const workoutPlanResult = await createWorkoutPlan(fitnessProfile, userData);
        console.log (dietPlanResult, workoutPlanResult);
        
        // Extract AI-generated plans from the services
        const aiWorkoutPlan = workoutPlanResult.aiPlan || null;
        const aiDietPlan = dietPlanResult.aiPlan || null;
        
        // Mark onboarding complete
        await markOnboardingComplete(userData._id);
        
        // Update user's onboarding status
        await User.findByIdAndUpdate(userData._id, { onboardingCompleted: true });

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
        console.error('Onboarding error:', error);
        
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



