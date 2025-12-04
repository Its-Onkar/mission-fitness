import { createFitness } from "../services/fitness.service.js";
import { generateWorkoutPlanFromAI, generateDietPlanFromAI } from "../services/aiPlans.service.js";
import { createWorkoutPlan } from "../services/workoutPlan.service.js";
import { createDietPlan } from "../services/diet.services.js";
import WorkoutPlan from "../Schema/workout.schema.js";
import DietPlan from "../Schema/diet.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";

export const fitnessController = async (req, res) => {
  try {
    const payload = req.body;
    const userData = req.auth;

    console.log("Creating fitness profile for user:", userData._id);

    // 1️⃣ Create fitness profile
    const fitness = await createFitness(payload, userData);

    // 2️⃣ Generate AI workout plan
    let aiWorkoutPlan = null;
    try {
      aiWorkoutPlan = await generateWorkoutPlanFromAI(fitness.fitnessProfile);
      console.log("✅ AI Workout Plan generated successfully");
    } catch (error) {
      console.error("⚠️ AI workout plan generation failed:", error.message);
    }

    // 3️⃣ Generate AI diet plan
    let aiDietPlan = null;
    try {
      aiDietPlan = await generateDietPlanFromAI(fitness.fitnessProfile);
      console.log("✅ AI Diet Plan generated successfully");
    } catch (error) {
      console.error("⚠️ AI diet plan generation failed:", error.message);
    }

    // 4️⃣ Generate traditional (rule-based) plans
    let workoutPlan = null, dietPlan = null;
    try {
      workoutPlan = await createWorkoutPlan(fitness, userData);
      dietPlan = await createDietPlan(fitness, userData);
    } catch (error) {
      console.error("⚠️ Traditional plan generation failed:", error.message);
    }

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      message: "Fitness profile and plans created successfully",
      data: {
        profile: fitness,
        plans: {
          aiWorkoutPlan,
          aiDietPlan,
          workoutPlan,
          dietPlan,
        },
      },
      redirectUrl: "/ai-plans",
    });
  } catch (error) {
    console.error("[FITNESS CONTROLLER ERROR]", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// 🧾 Fetch user's saved plans - Returns today's daily plan
export const getUserPlansController = async (req, res) => {
    try {
        const userId = req.auth._id;
        
        // Get user's fitness profile
        const fitnessProfile = await FitnessProfile.findOne({ user: userId });

        if (!fitnessProfile) {
            return res.status(404).json({
                success: false,
                message: "Fitness profile not found. Please complete onboarding first."
            });
        }

        // Get or create today's daily plan
        const { getOrCreateDailyPlan } = await import("../services/aiPlans.service.js");
        const dailyPlan = await getOrCreateDailyPlan(userId, fitnessProfile);

        // Return the daily plan data
        res.status(200).json({
            success: true,
            plans: {
                dailyPlan: dailyPlan,
                workoutPlan: dailyPlan?.workout,
                dietPlan: dailyPlan?.diet,
                fitnessProfile: {
                    goal: fitnessProfile.goal,
                    dietPreference: fitnessProfile.dietPreference,
                    fitnessLevel: fitnessProfile.fitnessLevel
                }
            }
        });
    } catch (error) {
        console.error("Error fetching user plans:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch plans"
        });
    }
};
