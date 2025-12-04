import User from "../Schema/user.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";
import WeightHistory from "../Schema/weightHistory.schema.js";
import DietLog from "../Schema/dietLog.schema.js";
import WorkoutLog from "../Schema/workoutLog.schema.js";
import DailyPlan from "../Schema/dailyPlan.schema.js";
import { getOrCreateDailyPlan } from "./aiPlans.service.js";

export const getDashboardData = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const user = await User.findById(userId).select("-password");
  const fitnessProfile = await FitnessProfile.findOne({ user: userId });

  if (!user) throw new Error("User not found");

  // 1. Daily Plan (AI Generated)
  let dailyPlan = null;
  if (fitnessProfile) {
    try {
      dailyPlan = await getOrCreateDailyPlan(userId, fitnessProfile);
    } catch (err) {
      console.error("Error generating daily plan:", err);
    }
  }

  // Calculate TDEE (Total Daily Energy Expenditure) for default targets
  let dailyCaloriesTarget = 2000;
  if (fitnessProfile) {
    const { gender, weightKg, heightCm, age, activityLevel, goal } = fitnessProfile;
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;

    const activityMultipliers = {
      "mostly sitting": 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "super active": 1.9
    };
    
    let tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    if (goal === 'weight loss') tdee -= 500;
    else if (goal === 'weight gain') tdee += 500;

    dailyCaloriesTarget = Math.round(tdee);
  }

  // 2. Weight Data
  const weightHistory = await WeightHistory.find({ user: userId }).sort({ date: -1 }).limit(2);
  const currentWeight = weightHistory[0]?.weight || fitnessProfile?.weightKg || 0;
  const prevWeight = weightHistory[1]?.weight || currentWeight;
  const weightDiff = (currentWeight - prevWeight).toFixed(1);
  
  // Use startWeight from profile if available, otherwise fallback to first history or current
  const startWeight = fitnessProfile?.startWeight || currentWeight;
  const totalLost = (startWeight - currentWeight).toFixed(1);

  // 3. Diet Data
  let dietLog = await DietLog.findOne({ user: userId, date: today });
  if (!dietLog) {
    dietLog = { caloriesEaten: 0, caloriesTarget: dailyCaloriesTarget, waterIntake: 0, consistencyScore: 0 };
  }

  // 4. Workout Data
  let workoutLog = await WorkoutLog.findOne({ user: userId, date: today });
  if (!workoutLog) {
    workoutLog = { duration: 0, targetDuration: 45, caloriesBurned: 0, poseAccuracy: 0, consistencyScore: 0 };
  }

  // 5. Weekly Stats (Aggregation)
  const oneWeekAgo = new Date();
};
