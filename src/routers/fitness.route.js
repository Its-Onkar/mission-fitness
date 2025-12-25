import { Router } from "express";
import performAuthorization from "../middleware/auth.js";
import { fitnessController, getUserPlansController } from "../controllers/fitness.controller.js";
import { getFitnessResponse } from "../utils/prompt.utils.js";

const fitnessRouter = Router();

fitnessRouter.post("/", performAuthorization, fitnessController);
fitnessRouter.get("/plans", performAuthorization, getUserPlansController);

// AI recommendations endpoint
fitnessRouter.post("/ai-recommendations", performAuthorization, async (req, res) => {
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
            userId: userData._id
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
});

export default fitnessRouter;
