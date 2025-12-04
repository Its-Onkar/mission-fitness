import { markWorkoutComplete, markDietComplete, getUserPerformance } from "../services/performance.service.js";
import { sendCompletionEmail } from "../services/email.service.js";

// Debug endpoint to test authentication
export const testAuth = async (req, res) => {
  try {
    console.log('Test auth endpoint called');
    console.log('Headers:', req.headers);
    console.log('Auth object:', req.auth);
    console.log('Token:', req.token);
    
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        debug: {
          hasAuth: !!req.auth,
          hasAuthId: !!(req.auth && req.auth._id),
          hasToken: !!req.token
        }
      });
    }
    
    res.status(200).json({
      message: 'Authentication successful',
      user: {
        id: req.auth._id,
        userName: req.auth.userName,
        email: req.auth.email
      },
      hasToken: !!req.token
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({ message: 'Test auth failed: ' + error.message });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.auth._id;
    console.log('Marking workout complete for user:', userId);
    
    const performance = await markWorkoutComplete(userId);
    console.log('Workout marked complete:', {
      userId,
      streak: performance.streak,
      score: performance.score,
      workoutCompleted: performance.workoutCompleted,
      dietCompleted: performance.dietCompleted
    });
    
    // Send completion email if user has email notifications enabled
    if (req.auth.permissions?.emailUpdates) {
      try {
        await sendCompletionEmail(req.auth, 'workout');
        console.log('Completion email sent');
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }
    
    res.status(200).json({
      message: "Workout marked as complete!",
      performance,
      streak: performance.streak,
      score: performance.score
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({ message: 'Failed to mark workout complete: ' + error.message });
  }
};

export const completeDiet = async (req, res) => {
  try {
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.auth._id;
    console.log('Marking diet complete for user:', userId);
    
    const performance = await markDietComplete(userId);
    console.log('Diet marked complete:', performance);
    
    // Send completion email if user has email notifications enabled
    if (req.auth.permissions?.emailUpdates) {
      try {
        await sendCompletionEmail(req.auth, 'diet');
        console.log('Completion email sent');
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }
    
    res.status(200).json({
      message: "Diet marked as complete!",
      performance,
      streak: performance.streak,
      score: performance.score
    });
  } catch (error) {
    console.error('Complete diet error:', error);
    res.status(500).json({ message: 'Failed to mark diet complete: ' + error.message });
  }
};

export const getPerformanceData = async (req, res) => {
  try {
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.auth._id;
    const days = parseInt(req.query.days) || 7;
    const performance = await getUserPerformance(userId, days);
    
    res.status(200).json({ performance });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ message: 'Failed to get performance data' });
  }
};

export const getPerformanceStats = async (req, res) => {
  try {
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.auth._id;
    const Performance = (await import("../Schema/performance.schema.js")).default;
    
    // Get last 30 days of performance data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const performances = await Performance.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });
    
    // Calculate stats
    const totalDays = performances.length;
    const workoutDays = performances.filter(p => p.workoutCompleted).length;
    const dietDays = performances.filter(p => p.dietCompleted).length;
    const totalScore = performances.reduce((sum, p) => sum + (p.score || 0), 0);
    
    // Get current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < performances.length; i++) {
      const perf = performances[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (perf.date.getTime() === expectedDate.getTime() && 
          (perf.workoutCompleted || perf.dietCompleted)) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    res.status(200).json({
      currentStreak,
      workoutCompletionRate: totalDays > 0 ? Math.round((workoutDays / totalDays) * 100) : 0,
      dietCompletionRate: totalDays > 0 ? Math.round((dietDays / totalDays) * 100) : 0,
      totalScore
    });
  } catch (error) {
    console.error('Get performance stats error:', error);
    res.status(500).json({ message: 'Failed to get performance stats' });
  }
};