import mongoose from "mongoose";
import fitnessProfileSchema from "../Schema/fitnessprofile.schema.js";
import workoutSchema from "../Schema/workout.schema.js";
import dietSchema from "../Schema/diet.schema.js";
import { getFitnessResponses } from "./chat.service.js";


export const createFitness = async (payload, userData) => {
  

  try {
    // 1️⃣ Create FitnessProfile
    const fitnessProfile = await fitnessProfileSchema.create([{
      user: userData._id,
      gender: payload.gender,
      age: payload.age,
      heightCm: payload.heightCm,
      weightKg: payload.weightKg,
      goal: payload.goal,
      fitnessLevel: payload.fitnessLevel,
      activityLevel: payload.activityLevel,
      workoutPreference: payload.workoutPreference,
      availableEquipment: payload.availableEquipment,
      preferredWorkoutTime: payload.preferredWorkoutTime,
      medicalConditions: payload.medicalConditions,
      dietPreference: payload.dietPreference,
      exerciseFrequency: payload.exerciseFrequency,
      permissions: payload.permissions,
      createdBy: userData._id
    }]);

    const profile = fitnessProfile[0];

    // 2️⃣ Call AI to get schema-aligned WorkoutPlan and DietPlan
    const aiResponse = await getFitnessResponses(profile, "Create full weekly workout and diet plan");

    if (!aiResponse.workoutPlanData || !aiResponse.dietPlanData) {
      throw new Error("AI did not return valid plan data");
    }

    // 3️⃣ Save WorkoutPlan
    const workoutPlan = await workoutSchema.create([{
      user: userData._id,
      fitnessProfile: profile._id,
      title: aiResponse.workoutPlanData.title || "7-Day AI Workout Plan",
      routines: aiResponse.workoutPlanData.routines,
      goal: profile.goal
    }]);

    // 4️⃣ Save DietPlan
    const dietPlan = await dietSchema.create([{
      user: userData._id,
      fitnessProfile: profile._id,
      goal: profile.goal,
      meals: aiResponse.dietPlanData.meals
    }]);

    // 5️⃣ Update FitnessProfile with plan references
    await fitnessProfileSchema.updateOne(
      { _id: profile._id },
      {
        workoutPlan: workoutPlan[0]._id,
        dietPlan: dietPlan[0]._id,
        isComplete: true
      },
     
    );



    return {
      fitnessProfile: profile,
      workoutPlan: workoutPlan[0],
      dietPlan: dietPlan[0]
    };

  } catch (error) {
 
    throw new Error("Failed to create fitness profile: " + error.message);
  }
};
