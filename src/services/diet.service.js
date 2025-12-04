import DietLog from "../Schema/dietLog.schema.js";

export const logCalories = async (userId, calories, mealType = 'general') => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let dietLog = await DietLog.findOne({ user: userId, date: today });
    
    if (!dietLog) {
      // Create new diet log for today
      dietLog = new DietLog({
        user: userId,
        date: today,
        caloriesEaten: calories,
        caloriesTarget: 2000, // Default, should be calculated based on user profile
        meals: [{
          type: mealType,
          calories: calories,
          timestamp: new Date()
        }]
      });
    } else {
      // Update existing diet log
      dietLog.caloriesEaten += calories;
      dietLog.meals.push({
        type: mealType,
        calories: calories,
        timestamp: new Date()
      });
    }
    
    // Calculate consistency score
    const percentage = (dietLog.caloriesEaten / dietLog.caloriesTarget) * 100;
    if (percentage >= 90 && percentage <= 110) {
      dietLog.consistencyScore = 100;
    } else if (percentage >= 80 && percentage <= 120) {
      dietLog.consistencyScore = 80;
    } else if (percentage >= 70 && percentage <= 130) {
      dietLog.consistencyScore = 60;
    } else {
      dietLog.consistencyScore = 40;
    }
    
    await dietLog.save();
    
    return {
      success: true,
      caloriesEaten: dietLog.caloriesEaten,
      caloriesTarget: dietLog.caloriesTarget,
      consistencyScore: dietLog.consistencyScore,
      message: 'Calories logged successfully'
    };
  } catch (error) {
    console.error('Error logging calories:', error);
    throw error;
  }
};

export const logWater = async (userId, amount) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let dietLog = await DietLog.findOne({ user: userId, date: today });
    
    if (!dietLog) {
      dietLog = new DietLog({
        user: userId,
        date: today,
        waterIntake: amount
      });
    } else {
      dietLog.waterIntake += amount;
    }
    
    await dietLog.save();
    
    return {
      success: true,
      waterIntake: dietLog.waterIntake,
      message: 'Water intake logged successfully'
    };
  } catch (error) {
    console.error('Error logging water:', error);
    throw error;
  }
};
