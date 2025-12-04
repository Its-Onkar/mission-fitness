import Performance from "../Schema/performance.schema.js";
import { sendEmail } from "./email.service.js";
import logger from "../utils/logger.js";

export const markWorkoutComplete = async (userId) => {
  try {
    logger.info('Marking workout complete', { userId });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let performance = await Performance.findOne({ user: userId, date: today });
    
    if (!performance) {
      performance = new Performance({ user: userId, date: today });
      logger.debug('Created new performance record', { userId, date: today });
    }
    
    // Prevent duplicate completions
    if (performance.workoutCompleted) {
      logger.warn('Workout already completed today', { userId });
      return performance;
    }
    
    performance.workoutCompleted = true;
    performance.workoutCompletedAt = new Date();
    performance.score += 50;
    
    // Calculate streak based on consecutive days of activity
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayPerf = await Performance.findOne({ user: userId, date: yesterday });
    
    if (!yesterdayPerf || (!yesterdayPerf.workoutCompleted && !yesterdayPerf.dietCompleted)) {
      performance.streak = 1;
      logger.info('Streak reset to 1', { userId });
    } else {
      performance.streak = (yesterdayPerf.streak || 0) + 1;
      logger.info('Streak continued', { userId, streak: performance.streak });
    }
    
    // Bonus for completing both on same day
    if (performance.workoutCompleted && performance.dietCompleted) {
      performance.score += 25;
      logger.info('Bonus points awarded for completing both', { userId });
    }
    
    await performance.save();
    logger.success('Workout marked complete', { userId, score: performance.score, streak: performance.streak });
    
    return performance;
  } catch (error) {
    logger.error('Error marking workout complete', { userId, error: error.message });
    throw error;
  }
};

export const markDietComplete = async (userId) => {
  try {
    logger.info('Marking diet complete', { userId });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let performance = await Performance.findOne({ user: userId, date: today });
    
    if (!performance) {
      performance = new Performance({ user: userId, date: today });
      logger.debug('Created new performance record', { userId, date: today });
    }
    
    // Prevent duplicate completions
    if (performance.dietCompleted) {
      logger.warn('Diet already completed today', { userId });
      return performance;
    }
    
    performance.dietCompleted = true;
    performance.dietCompletedAt = new Date();
    performance.score += 50;
    
    // Calculate streak based on consecutive days of activity
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayPerf = await Performance.findOne({ user: userId, date: yesterday });
    
    if (!yesterdayPerf || (!yesterdayPerf.workoutCompleted && !yesterdayPerf.dietCompleted)) {
      performance.streak = 1;
      logger.info('Streak reset to 1', { userId });
    } else {
      performance.streak = (yesterdayPerf.streak || 0) + 1;
      logger.info('Streak continued', { userId, streak: performance.streak });
    }
    
    // Bonus for completing both on same day
    if (performance.workoutCompleted && performance.dietCompleted) {
      performance.score += 25;
      logger.info('Bonus points awarded for completing both', { userId });
    }
    
    await performance.save();
    logger.success('Diet marked complete', { userId, score: performance.score, streak: performance.streak });
    
    return performance;
  } catch (error) {
    logger.error('Error marking diet complete', { userId, error: error.message });
    throw error;
  }
};

export const getUserPerformance = async (userId, days = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await Performance.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: -1 });
};

export const checkMissedActivities = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const User = (await import("../Schema/user.schema.js")).default;
  const users = await User.find({ isVerified: true, onboardingCompleted: true });
  
  for (const user of users) {
    const performance = await Performance.findOne({ user: user._id, date: yesterday });
    
    if (!performance || (!performance.workoutCompleted && !performance.dietCompleted)) {
      await sendWarningEmail(user);
    }
  }
};

const sendWarningEmail = async (user) => {
  const subject = "⚠️ Missed Your Fitness Goals Yesterday";
  const html = `
    <h2>Don't Break Your Streak! 💪</h2>
    <p>Hi ${user.userName},</p>
    <p>We noticed you missed your fitness activities yesterday. Don't worry - every champion has off days!</p>
    <p>Get back on track today:</p>
    <ul>
      <li>✅ Complete your workout</li>
      <li>🥗 Follow your meal plan</li>
      <li>💧 Stay hydrated</li>
    </ul>
    <p>Your fitness journey matters. Let's make today count!</p>
    <a href="${process.env.CLIENT_URL}/ai-plans" style="background: #EE6D0F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Plans</a>
  `;
  
  await sendEmail(user.email, subject, html);
};