import { getOnboardingDataByUserId, updateOnboardingData, createOnboardingData, markOnboardingComplete } from "../services/onboarding.service.js";

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
        const newOnboardingData = await createOnboardingData(onboardingData);
        res.status(201).json(newOnboardingData);
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


export const markOnboardingCompleteController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = await markOnboardingComplete(userId);
        res.status(200).json({ message: "Onboarding marked as complete", data: updatedData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


