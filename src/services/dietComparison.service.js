import FoodLog from "../Schema/foodLog.schema.js";
import DailyPlan from "../Schema/dailyPlan.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";

export const logFood = async (userId, foodData) => {
  try {
    const { foodName, mealType, calories, protein = 0, carbs = 0, fats = 0 } = foodData;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Determine if food is healthy based on name
    const unhealthyKeywords = ['pizza', 'burger', 'fries', 'soda', 'candy', 'cake', 'chips', 'fried', 'junk'];
    const isHealthy = !unhealthyKeywords.some(keyword => foodName.toLowerCase().includes(keyword));
    
    const foodLog = new FoodLog({
      user: userId,
      date: today,
      mealType,
      foodName,
      calories,
      protein,
      carbs,
      fats,
      isHealthy
    });
    
    await foodLog.save();
    return foodLog;
  } catch (error) {
    throw new Error(`Failed to log food: ${error.message}`);
  }
};

export const getDietComparison = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get user's food logs for today
    const foodLogs = await FoodLog.find({ user: userId, date: today });
    
    // Get AI diet plan for today
    const dailyPlan = await DailyPlan.findOne({ user: userId, date: today.toISOString().split('T')[0] });
    
    // Get user's fitness profile for target calculations
    const fitnessProfile = await FitnessProfile.findOne({ user: userId });
    
    // Calculate target calories based on user profile
    let targetCalories = 2000;
    let targetProtein = 120;
    
    if (fitnessProfile) {
      const { gender, weightKg, heightCm, age, goal } = fitnessProfile;
      let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
      bmr += gender === 'male' ? 5 : -161;
      
      const goalMultiplier = {
        'weight loss': 0.8,
        'muscle gain': 1.2,
        'maintenance': 1.0
      }[goal] || 1.0;
      
      targetCalories = Math.round(bmr * 1.4 * goalMultiplier);
      targetProtein = Math.round(weightKg * 1.6); // 1.6g per kg for fitness
    }
    
    // Calculate actual intake
    const actualCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const actualProtein = foodLogs.reduce((sum, log) => sum + log.protein, 0);
    const actualCarbs = foodLogs.reduce((sum, log) => sum + log.carbs, 0);
    const actualFats = foodLogs.reduce((sum, log) => sum + log.fats, 0);
    
    // Calculate scores
    const calorieScore = Math.max(0, 100 - Math.abs(actualCalories - targetCalories) / targetCalories * 100);
    const proteinScore = Math.min(100, (actualProtein / targetProtein) * 100);
    
    // Quality score based on healthy vs unhealthy foods
    const healthyFoods = foodLogs.filter(log => log.isHealthy).length;
    const totalFoods = foodLogs.length;
    const qualityScore = totalFoods > 0 ? (healthyFoods / totalFoods) * 100 : 100;
    
    // Timing score based on meal distribution
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const loggedMeals = [...new Set(foodLogs.map(log => log.mealType))];
    const timingScore = (loggedMeals.filter(meal => mealTypes.includes(meal)).length / mealTypes.length) * 100;
    
    // Overall consistency score
    const consistencyScore = Math.round((calorieScore + proteinScore + qualityScore + timingScore) / 4);
    
    // Generate insights
    const insights = generateInsights(actualCalories, targetCalories, actualProtein, targetProtein, consistencyScore);
    
    return {
      target: {
        calories: targetCalories,
        protein: targetProtein,
        carbs: Math.round(targetCalories * 0.45 / 4), // 45% of calories from carbs
        fats: Math.round(targetCalories * 0.25 / 9) // 25% of calories from fats
      },
      actual: {
        calories: actualCalories,
        protein: actualProtein,
        carbs: actualCarbs,
        fats: actualFats
      },
      differences: {
        calories: actualCalories - targetCalories,
        protein: actualProtein - targetProtein,
        carbs: actualCarbs - Math.round(targetCalories * 0.45 / 4),
        fats: actualFats - Math.round(targetCalories * 0.25 / 9)
      },
      scores: {
        calories: Math.round(calorieScore),
        protein: Math.round(proteinScore),
        quality: Math.round(qualityScore),
        timing: Math.round(timingScore),
        overall: consistencyScore
      },
      insights,
      foodLogs: foodLogs.map(log => ({
        mealType: log.mealType,
        foodName: log.foodName,
        calories: log.calories,
        isHealthy: log.isHealthy,
        loggedAt: log.loggedAt
      }))
    };
  } catch (error) {
    throw new Error(`Failed to get diet comparison: ${error.message}`);
  }
};

const generateInsights = (actualCal, targetCal, actualProtein, targetProtein, score) => {
  const insights = [];
  
  const calDiff = actualCal - targetCal;
  if (calDiff > 200) {
    insights.push(`You overate by ${calDiff} calories. Try smaller portions.`);
  } else if (calDiff < -200) {
    insights.push(`You're ${Math.abs(calDiff)} calories under target. Eat more nutritious foods.`);
  } else {
    insights.push("Great calorie control today!");
  }
  
  const proteinDiff = actualProtein - targetProtein;
  if (proteinDiff < -20) {
    insights.push(`Add ${Math.abs(proteinDiff)}g more protein for muscle maintenance.`);
  } else if (proteinDiff > 0) {
    insights.push("Excellent protein intake!");
  }
  
  if (score >= 80) {
    insights.push("Outstanding diet consistency! Keep it up! 🎉");
  } else if (score >= 60) {
    insights.push("Good progress! Small improvements will boost your score.");
  } else {
    insights.push("Focus on whole foods and proper portions for better results.");
  }
  
  return insights;
};
