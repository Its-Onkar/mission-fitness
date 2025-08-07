import { createWorkoutPlan,getAllWorkoutPlans,getWorkoutPlanByUserId,updateWorkoutPlanByUserName } from "../services/workoutPlan.service.js";

export const createWorkoutPlanController = async (req, res) => {
    try {
        // check if workout plan already exists for the user
        const userId = req.auth._id;
        const existingPlan = await getWorkoutPlanByUserId(userId);
        if (existingPlan) {
            return res.status(400).json({ message: "Workout plan already exists for this user" });
        }   
        const workoutData = req.body;
        const userData = req.auth;
        const workoutPlan = await createWorkoutPlan(workoutData, userData);
        res.status(200).json(workoutPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllWorkoutPlansController = async (req, res) => {
    try {
        // only admin can access all workout plans
        if (!req.auth.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }
        const workoutPlans = await getAllWorkoutPlans();
        res.status(200).json(workoutPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   


export const getWorkoutPlanByUserIdController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error("User ID not provided");
        const workoutPlan = await getWorkoutPlanByUserId(userId);
        res.status(200).json(workoutPlan);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateWorkoutPlanByUserNameController = async (req, res) => {
    try {
        const { userName } = req.params;
        const updateData = req.body;
        const updatedWorkoutPlan = await updateWorkoutPlanByUserName(userName, updateData);
        if (!updatedWorkoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }
        res.status(200).json({ message: "Workout plan updated successfully", workoutPlan: updatedWorkoutPlan });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

