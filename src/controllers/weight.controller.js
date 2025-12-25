import { addWeight, getWeightHistory, getWeightProgress } from "../services/weight.service.js";
import { getEnhancedWeightProgress } from "../services/weight-enhanced.service.js";

export const logWeightController = async (req, res) => {
  try {
    const user = req.user || req.auth;
    if (!user || !user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in again.' 
      });
    }
    
    const userId = user._id;
    const { weight, notes } = req.body;
    
    // Validate weight input
    if (!weight) {
      return res.status(400).json({ 
        success: false,
        message: 'Weight is required' 
      });
    }
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid weight between 20-300 kg' 
      });
    }
    
    const result = await addWeight(userId, weightNum, notes || '');
    
    res.status(200).json({
      success: true,
      message: 'Weight logged successfully',
      ...result
    });
    
  } catch (error) {
    console.error('Weight logging error:', error);
    
    // Provide specific error messages
    let errorMessage = 'Failed to log weight';
    if (error.message.includes('User ID')) {
      errorMessage = 'Authentication error. Please log in again.';
    } else if (error.message.includes('weight')) {
      errorMessage = error.message;
    } else if (error.message.includes('database') || error.message.includes('connection')) {
      errorMessage = 'Database connection error. Please try again.';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getWeightHistoryController = async (req, res) => {
  try {
    const user = req.user || req.auth;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = user._id;
    const limit = parseInt(req.query.limit) || 30;
    
    const history = await getWeightHistory(userId, limit);
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error getting weight history:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getWeightProgressController = async (req, res) => {
  try {
    const user = req.user || req.auth;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = user._id;
    const progress = await getWeightProgress(userId);
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error getting weight progress:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getEnhancedWeightProgressController = async (req, res) => {
  try {
    const user = req.user || req.auth;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = user._id;
    const progress = await getEnhancedWeightProgress(userId);
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error("Error getting enhanced weight progress:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
