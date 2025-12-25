import WeightHistory from "../Schema/weightHistory.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";

export const getEnhancedWeightProgress = async (userId) => {
  try {
    const history = await WeightHistory.find({ user: userId }).sort({ date: -1 }).limit(30);
    const fitnessProfile = await FitnessProfile.findOne({ user: userId });
    
    if (history.length === 0) {
      return {
        current: fitnessProfile?.weightKg || 0,
        previous: 0,
        difference: 0,
        totalProgress: 0,
        trend: 'stable',
        weeklyChange: 0,
        monthlyChange: 0,
        target: fitnessProfile?.targetWeight || 0,
        startWeight: fitnessProfile?.startWeight || fitnessProfile?.weightKg || 0,
        goal: fitnessProfile?.goal || 'maintenance',
        goalProgress: 0,
        isMovingTowardGoal: false,
        performance: 'average',
        recommendations: 'Start logging weight daily for better insights'
      };
    }
    
    const current = history[0];
    const previous = history[1] || current;
    const goal = fitnessProfile?.goal || 'maintenance';
    const startWeight = fitnessProfile?.startWeight || fitnessProfile?.weightKg || current.weight;
    const targetWeight = fitnessProfile?.targetWeight || current.weight;
    
    // Calculate weekly change
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntry = history.find(entry => entry.date <= oneWeekAgo) || current;
    const weeklyChange = current.weight - weeklyEntry.weight;
    
    // Calculate monthly change
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthlyEntry = history.find(entry => entry.date <= oneMonthAgo) || current;
    const monthlyChange = current.weight - monthlyEntry.weight;
    
    // Determine trend
    let trend = 'stable';
    if (current.differenceFromLast > 0.2) trend = 'gained';
    else if (current.differenceFromLast < -0.2) trend = 'lost';
    
    // Calculate goal-based metrics
    const goalAnalysis = calculateGoalAnalysis(current.weight, startWeight, targetWeight, previous.weight, goal);
    
    return {
      current: current.weight,
      previous: previous.weight,
      difference: current.differenceFromLast,
      totalProgress: current.totalProgress,
      trend,
      weeklyChange,
      monthlyChange,
      target: targetWeight,
      startWeight: startWeight,
      goal: goal,
      goalProgress: goalAnalysis.goalProgress,
      isMovingTowardGoal: goalAnalysis.isMovingTowardGoal,
      performance: goalAnalysis.performance,
      remainingToTarget: goalAnalysis.remainingToTarget,
      recommendations: goalAnalysis.recommendations,
      entries: history.slice(0, 5)
    };
  } catch (error) {
    throw new Error(`Failed to get weight progress: ${error.message}`);
  }
};

const calculateGoalAnalysis = (current, start, target, previous, goal) => {
  let goalProgress = 0;
  let remainingToTarget = 0;
  let isMovingTowardGoal = false;
  let performance = 'average';
  let recommendations = '';
  
  if (goal === 'weight loss') {
    remainingToTarget = Math.max(0, current - target);
    if (start !== target) {
      goalProgress = Math.max(0, Math.min(100, ((start - current) / (start - target)) * 100));
    }
    isMovingTowardGoal = current < previous;
    
    // Performance evaluation
    if (current <= target) performance = 'excellent';
    else if (goalProgress >= 70) performance = 'good';
    else if (goalProgress >= 30) performance = 'average';
    else performance = 'poor';
    
    // Recommendations
    if (performance === 'excellent') {
      recommendations = 'Goal achieved! Focus on maintenance now.';
    } else if (performance === 'poor') {
      recommendations = 'Increase calorie deficit: reduce portions, add cardio.';
    } else if (!isMovingTowardGoal) {
      recommendations = 'Weight trending up - review diet and exercise plan.';
    } else {
      recommendations = 'Good progress! Stay consistent with current plan.';
    }
    
  } else if (goal === 'weight gain') {
    remainingToTarget = Math.max(0, target - current);
    if (target !== start) {
      goalProgress = Math.max(0, Math.min(100, ((current - start) / (target - start)) * 100));
    }
    isMovingTowardGoal = current > previous;
    
    // Performance evaluation
    if (current >= target) performance = 'excellent';
    else if (goalProgress >= 70) performance = 'good';
    else if (goalProgress >= 30) performance = 'average';
    else performance = 'poor';
    
    // Recommendations
    if (performance === 'excellent') {
      recommendations = 'Target reached! Consider maintenance or new goals.';
    } else if (performance === 'poor') {
      recommendations = 'Increase calorie surplus: eat more protein, lift weights.';
    } else if (!isMovingTowardGoal) {
      recommendations = 'Weight trending down - increase calorie intake.';
    } else {
      recommendations = 'Good progress! Continue with current nutrition plan.';
    }
    
  } else {
    // Maintenance goal
    const deviation = Math.abs(current - target);
    remainingToTarget = deviation;
    goalProgress = Math.max(0, 100 - (deviation * 10));
    isMovingTowardGoal = Math.abs(current - target) <= Math.abs(previous - target);
    
    // Performance evaluation
    if (deviation <= 1) performance = 'excellent';
    else if (deviation <= 2) performance = 'good';
    else if (deviation <= 3) performance = 'average';
    else performance = 'poor';
    
    // Recommendations
    if (performance === 'excellent') {
      recommendations = 'Perfect maintenance! Keep up current routine.';
    } else if (performance === 'poor') {
      recommendations = 'Large deviation - reassess nutrition and activity.';
    } else {
      recommendations = 'Balance diet and exercise for better maintenance.';
    }
  }
  
  return {
    goalProgress: Math.round(goalProgress),
    remainingToTarget: parseFloat(remainingToTarget.toFixed(1)),
    isMovingTowardGoal,
    performance,
    recommendations
  };
};