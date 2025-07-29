import { chatService } from "../services/chat.service.js";
export const chatController = async (req, res) => {
  try {
    const { userData, message } = req.body;

    if (!message || !userData) {
      return res.status(400).json({ error: "Both message and userData are required" });
    }

    const response = await chatService(userData, message);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in chatController:", error);
    res.status(500).json({ error: "Internal Server Error" ,
      message: error.message
     });
  }
};
