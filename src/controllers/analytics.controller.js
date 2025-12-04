import { getUserStats } from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.auth._id;
    const stats = await getUserStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};