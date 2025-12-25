import { checkMissedActivities } from "../services/performance.service.js";
import { sendCompletionEmail } from "../services/email.service.js";

export const testEmailNotification = async (req, res) => {
  try {
    const user = req.auth;
    await sendCompletionEmail(user, 'workout');
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const testMissedActivities = async (req, res) => {
  try {
    await checkMissedActivities();
    res.json({ message: 'Missed activities check completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const testPerformanceData = async (req, res) => {
  try {
    const Performance = (await import("../Schema/performance.schema.js")).default;
    const userId = req.auth._id;
    
    // Create test data for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Performance.findOneAndUpdate(
      { user: userId, date: today },
      { 
        workoutCompleted: true,
        dietCompleted: true,
        score: 125,
        streak: 5
      },
      { upsert: true }
    );
    
    res.json({ message: 'Test performance data created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const testDailyPlanGeneration = async (req, res) => {
  try {
    res.json({ message: 'Daily plan generation test disabled - service removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
