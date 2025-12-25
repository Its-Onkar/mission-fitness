import User from "../Schema/user.schema.js";
import Onboarding from "../Schema/onboarding.schema.js";

export const getUserStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    const onboarding = await Onboarding.findOne({ userId });
    
    const Performance = (await import("../Schema/performance.schema.js")).default;
    const recentPerformance = await Performance.find({ user: userId })
      .sort({ date: -1 })
      .limit(30);
    
    const completedWorkouts = recentPerformance.filter(p => p.workoutCompleted).length;
    const completedDiets = recentPerformance.filter(p => p.dietCompleted).length;
    const totalDays = recentPerformance.length || 1;
    
    return {
      user: {
        name: user.userName,
        email: user.email,
        joinDate: user.createdAt
      },
      stats: {
        workoutCompletionRate: Math.round((completedWorkouts / totalDays) * 100),
        dietCompletionRate: Math.round((completedDiets / totalDays) * 100),
        totalActiveDays: totalDays,
        currentStreak: calculateStreak(recentPerformance)
      },
      profile: {
        goal: onboarding?.goal || 'Not set',
        fitnessLevel: onboarding?.fitnessLevel || 'Not set',
        dietPreference: onboarding?.dietPreference || 'None'
      }
    };
  } catch (error) {
    throw new Error(`Failed to get user stats: ${error.message}`);
  }
};

const calculateStreak = (performance) => {
  if (!performance.length) return 0;
  
  let streak = 0;
  const sortedPerf = performance.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  for (const perf of sortedPerf) {
    if (perf.workoutCompleted || perf.dietCompleted) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
