import { getOnboardingDataByUserId, updateOnboardingData, createOnboardingData, } from "../services/onboarding.service.js";
import { markOnboardingComplete } from "../services/user.service.js";
import { generatePlanFromAI } from "../services/workoutPlan.service.js";

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
        const userData = req.auth
        const newOnboardingData = await createOnboardingData(onboardingData, userData);
        const aiResponse = await generatePlanFromAI(onboardingData);
        const { workoutPlan, dietPlan } = aiResponse;
        await markOnboardingComplete(newOnboardingData.userId);
        console.log("AI Generated Workout Plan:", workoutPlan);
        console.log("AI Generated Diet Plan:", dietPlan);
        res.status(201).json({
            message: "Onboarding completed, plan generated",
            onboarding: newOnboardingData,
            plan: {
                workoutPlan,
                dietPlan
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
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




