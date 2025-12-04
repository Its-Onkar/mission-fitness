import Diet from "../Schema/diet.schema.js";
import { generateDietPlanFromAI } from "./aiPlans.service.js";

export const createDietPlan = async (dietData, userData) => {
  const { _id } = userData;
  const dietGoal = dietData.fitnessGoal || dietData.goal || "balanced";
  const dietDuration = dietData.dietDuration || "week";
  
  console.log('Creating diet plan with preference:', dietData.dietPreference);
  console.log('Full diet data:', dietData);

  const diet = await Diet.create({
    user: _id,
    fitnessProfile: dietData.fitnessProfile?._id || dietData._id,
    goal: dietGoal,
  });

  const aiResponse = await generateDietPlanFromAI(dietData);
  console.log("AI Diet Plan Response:", aiResponse);
  const { dietPlan } = aiResponse;
  const mealDetails = {
    data: dietPlan,
  };

 diet.mealDetails = mealDetails;
  diet.status = "in-progress";
  await diet.save();
  
  // Return both the database object and the AI-generated plan
  return {
      dbPlan: diet,
      aiPlan: dietPlan
  };
};

export const getAllDietPlans = async () => {
  const diets = await Diet.find({});

  if (!diets) {
    throw new Error("No diets found");
  }
    return diets;
};

 export const getDietplanByUserId = async (userId) => {
  const dietPlan = await Diet.findOne({ user: userId });
  if (!dietPlan) {
    throw new Error("Diet plan not found for the user");
  }
  return dietPlan;
};

export const updateDietPlanByUserName = async(userName, updateData) => {
  const dietPlan = await Diet.findOneAndUpdate(
    { userName },
    { $set: updateData },
    { new: true, runValidators: true }
  );    
  return dietPlan;
};
