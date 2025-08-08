import {createDietPlan ,  getDietplanByUserId , updateDietPlanByUserName} from "../services/diet.services.js";

export const createDietPlanController = async (req, res) => {
    try {
        const dietData = req.body;
        const UserData = req.auth;
        const dietPlan = await createDietPlan(dietData, UserData);
        res.status(200).json(dietPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getDietPlanByUserIdController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error("User ID not provided");
        const dietPlan = await getDietplanByUserId(userId);
        res.status(200).json(dietPlan);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateDietPlanByUserNameController = async (req, res) => {
    try {
        const { userName } = req.params;
        const updateData = req.body;
        const updatedDietPlan = await updateDietPlanByUserName(userName, updateData);
        if (!updatedDietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }
        res.status(200).json({ message: "Diet plan updated successfully", dietPlan: updatedDietPlan });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};






