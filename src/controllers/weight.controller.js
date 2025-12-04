import { addWeight, getWeightHistory, getWeightProgress } from "../services/weight.service.js";

export const logWeightController = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { weight, notes } = req.body;
    
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      return res.status(400).json({ message: "Valid weight between 20-300 kg is required" });
    }
    
    const result = await addWeight(userId, parseFloat(weight), notes || '');
    res.status(200).json(result);
  } catch (error) {
    console.error("Error logging weight:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getWeightHistoryController = async (req, res) => {
  try {
    const userId = req.auth._id;
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
    const userId = req.auth._id;
    const progress = await getWeightProgress(userId);
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error getting weight progress:", error);
    res.status(500).json({ message: error.message });
  }
};