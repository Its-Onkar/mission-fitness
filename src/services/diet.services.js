import Diet from "../Schema/diet.schema.js";

export const createDietPlan = async (dietData, userData) => {
  const { _id } = userData;
  const dietGoal = dietData.userGoal || "balanced";
  const dietDuration = dietData.dietDuration || "week";

  const diet = await Diet.create({
    userId: _id,
    dietPlan: dietGoal,
    dietDuration: dietDuration,
    status: "pending",
  });

  const aiResponse = await generatePlanFromAI(dietData);
  const { dietPlan } = aiResponse;
  const mealDetails = {
    data: dietPlan,
  };

  diet.mealDetails = mealDetails;
  diet.status = "in-progress";
  await diet.save();
  return diet;
};

export const getAllDietPlans = async () => {
  const diets = await Diet.find({});

  if (!diets) {
    throw new Error("No diets found");
  }
    return diets;
};

 export const getDietplanByUserId = async (userId) => {
  const dietPlan = await Diet.findOne({ userId });
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
