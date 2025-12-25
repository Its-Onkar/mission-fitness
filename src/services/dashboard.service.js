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
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyWorkouts = await WorkoutLog.countDocuments({ 
    user: userId, 
    date: { $gte: oneWeekAgo.toISOString().split('T')[0] } 
  });
  
  const weeklyCalories = await WorkoutLog.aggregate([
    { $match: { user: userId, date: { $gte: oneWeekAgo.toISOString().split('T')[0] } } },
    { $group: { _id: null, total: { $sum: "$caloriesBurned" } } }
  ]);

  // 6. AI Summary Message
  const readinessScore = Math.min(100, Math.round(
    (dietLog.consistencyScore * 0.4) + 
    (workoutLog.consistencyScore * 0.4) + 
    (Math.min(100, (dietLog.waterIntake / 8) * 100) * 0.2)
  ));

  const aiMessage = readinessScore >= 80 ? "You're crushing it today! 🔥" :
                   readinessScore >= 60 ? "Good momentum, keep it up! 💪" :
                   readinessScore >= 40 ? "Let's get moving today! 🚀" :
                   "Time to start your fitness journey! ✨";

  return {
    user: {
      name: user.name,
      email: user.email,
      goal: fitnessProfile?.goal || 'maintenance',
      currentWeight,
      targetWeight: fitnessProfile?.targetWeight || currentWeight,
      startWeight,
      needsOnboarding: !fitnessProfile?.isComplete
    },
    summary: {
      readinessScore,
      message: aiMessage,
      status: {
        sleep: "7h 30m",
        water: `${dietLog.waterIntake || 0}/8 glasses`,
        steps: "6,500 steps"
      }
    },
    diet: {
      caloriesEaten: dietLog.caloriesEaten || 0,
      caloriesTarget: dietLog.caloriesTarget || dailyCaloriesTarget,
      proteinEaten: dietLog.proteinEaten || 0,
      proteinTarget: Math.round((dailyCaloriesTarget * 0.25) / 4),
      carbsEaten: dietLog.carbsEaten || 0,
      carbsTarget: Math.round((dailyCaloriesTarget * 0.45) / 4),
      fatsEaten: dietLog.fatsEaten || 0,
      fatsTarget: Math.round((dailyCaloriesTarget * 0.30) / 9),
      consistencyScore: dietLog.consistencyScore || 0,
      message: "Follow your AI plan for best results!",
      todaysPlan: dailyPlan?.diet?.meals || null
    },
    workout: {
      completedDuration: workoutLog.duration || 0,
      plannedDuration: workoutLog.targetDuration || 45,
      caloriesBurned: workoutLog.caloriesBurned || 0,
      consistencyScore: workoutLog.consistencyScore || 0,
      todaysStatus: workoutLog.duration > 0 ? 'completed' : 'pending',
      message: "Stay consistent!",
      weeklyStats: {
        completed: weeklyWorkouts,
        planned: 7
      },
      weeklyProgress: [false, false, false, false, false, false, false]
    },
    dailyPlan,
    weekly: {
      totalWorkouts: weeklyWorkouts,
      totalCalories: weeklyCalories[0]?.total || 0,
      totalSteps: 45000
    },
    streaks: {
      workout: 0,
      water: 0,
      badges: ["Beginner"]
    },
    calendar: {
      today: ["Today's Workout - 6:00 PM"]
    }
  };
};
