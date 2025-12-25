import { updatePlanService } from "../services/update.service.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";
import WorkoutPlan from "../Schema/workout.schema.js";
import DietPlan from "../Schema/diet.schema.js";

export const updatePlanController = async (req, res) => {
  try {
    const { message } = req.body;
    const userData = req.auth;

    if (!message || !userData) {
      return res.status(400).json({ error: "Message and user data are required" });
    }

    // Get user's fitness profile
    const fitnessProfile = await FitnessProfile.findOne({ user: userData._id });
    if (!fitnessProfile) {
      return res.status(404).json({ error: "Fitness profile not found. Please complete onboarding first." });
    }

    // Get current plans
    const workoutPlan = await WorkoutPlan.findOne({ user: userData._id });
    const dietPlan = await DietPlan.findOne({ user: userData._id });
    
    if (!workoutPlan && !dietPlan) {
      return res.status(404).json({ error: "No existing plan found. Please generate a plan first." });
    }
    
    const currentPlan = {
      workoutPlan: workoutPlan?.toObject() || null,
      dietPlan: dietPlan?.toObject() || null
    };

    // Update plan using AI service
    const updatedPlan = await updatePlanService(
      fitnessProfile.toObject(),
      message,
      currentPlan
    );

    if (updatedPlan.error) {
      return res.status(400).json({ error: updatedPlan.error });
    }

    // Save updated plans
    if (updatedPlan.workoutPlan && workoutPlan) {
      await WorkoutPlan.findOneAndUpdate(
        { user: userData._id },
        { ...updatedPlan.workoutPlan, updatedAt: new Date() },
        { new: true }
      );
    }
    
    if (updatedPlan.dietPlan && dietPlan) {
      await DietPlan.findOneAndUpdate(
        { user: userData._id },
        { ...updatedPlan.dietPlan, updatedAt: new Date() },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Plan updated successfully!",
      response: updatedPlan.response || "Your fitness plan has been updated!",
      updatedPlan
    });

  } catch (error) {
    console.error("Error in updatePlanController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};
