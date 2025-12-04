import WeightHistory from "../Schema/weightHistory.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";

export const addWeight = async (userId, weight, notes = '') => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if weight already logged today
    const existingEntry = await WeightHistory.findOne({ 
      user: userId, 
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    if (existingEntry) {
      // Update existing entry
      existingEntry.weight = weight;
      existingEntry.notes = notes;
      await existingEntry.save();
      return await calculateProgress(userId, existingEntry);
    }
    
    // Get last weight entry for comparison
    const lastEntry = await WeightHistory.findOne({ user: userId }).sort({ date: -1 });
    
    // Get starting weight from fitness profile
    const fitnessProfile = await FitnessProfile.findOne({ user: userId });
    
    // Set starting weight if not already set (from onboarding)
    if (!fitnessProfile.startWeight && fitnessProfile.weightKg) {
      fitnessProfile.startWeight = fitnessProfile.weightKg;
      await fitnessProfile.save();
    }
    
    const startWeight = fitnessProfile?.startWeight || fitnessProfile?.weightKg || weight;
    
    const differenceFromLast = lastEntry ? weight - lastEntry.weight : 0;
    const totalProgress = startWeight - weight;
    
    const newEntry = new WeightHistory({
      user: userId,
      weight,
      date: today,
      differenceFromLast,
      totalProgress,
      notes
    });
    
    await newEntry.save();
    return await calculateProgress(userId, newEntry);
  } catch (error) {
    throw new Error(`Failed to add weight: ${error.message}`);
  }
};

export const getWeightHistory = async (userId, limit = 30) => {
  try {
    return await WeightHistory.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit);
  } catch (error) {
    throw new Error(`Failed to get weight history: ${error.message}`);
  }
};

export const getWeightProgress = async (userId) => {
  try {
    const history = await WeightHistory.find({ user: userId }).sort({ date: -1 }).limit(30);
    
    if (history.length === 0) {
      return {
        current: 0,
        previous: 0,
        difference: 0,
        totalProgress: 0,
        trend: 'stable',
        weeklyChange: 0,
        monthlyChange: 0
      };
    }
    
    const current = history[0];
    const previous = history[1] || current;
    
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
    
    return {
      current: current.weight,
      previous: previous.weight,
      difference: current.differenceFromLast,
      totalProgress: current.totalProgress,
      trend,
      weeklyChange,
      monthlyChange,
      entries: history.slice(0, 5)
    };
  } catch (error) {
    throw new Error(`Failed to get weight progress: ${error.message}`);
  }
};

const calculateProgress = async (userId, currentEntry) => {
  const progress = await getWeightProgress(userId);
  return {
    message: "Weight logged successfully",
    entry: currentEntry,
    progress
  };
};