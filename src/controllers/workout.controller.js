<<<<<<< Updated upstream
import { createWorkoutPlan,getAllWorkoutPlans,getWorkoutPlanByUserId,updateWorkoutPlanByUserName } from "../services/workoutPlan.service.js";

=======
import { createWorkoutPlan,getWorkoutPlanByUserId,updateWorkoutPlanByUserName } from "../services/workoutPlan.service.js";
import { generateWorkoutPlanFromAI } from "../services/aiPlans.service.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";
>>>>>>> Stashed changes
export const createWorkoutPlanController = async (req, res) => {
    try {
    const userId = req.auth._id;

    // Step 1: Check if workout plan already exists
    const existingPlan = await getWorkoutPlanByUserId(userId);
    if (existingPlan) {
        return res.status(400).json({ message: "Workout plan already exists for this user" });
    }

    // Step 2: Fetch Fitness Profile
    const fitnessProfile = await FitnessProfile.findOne({ user: userId });
    if (!fitnessProfile) {
        return res.status(404).json({ message: "Fitness profile not found. Please complete onboarding first." });
    }

    // Step 3: Generate AI-based plan
    const aiData = await generateWorkoutPlanFromAI(fitnessProfile);
    if (!aiData) {
        return res.status(400).json({ message: "AI could not generate a workout plan" });
    }

    console.log("AI-generated workout plan:", aiData);

    // Step 4: Save plan to database
    const userData = req.auth;
    const workoutPlan = await createWorkoutPlan(aiData, userData);

    // Step 5: Respond to client
    res.status(200).json({
        message: "AI workout plan generated and saved successfully",
        plan: workoutPlan,
    });

} catch (error) {
    console.error("Error generating workout plan:", error);
    res.status(500).json({ error: error.message });
}
};

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

