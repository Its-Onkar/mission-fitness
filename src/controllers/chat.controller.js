import { chatService } from "../services/chat.service.js";
export const chatController = async (req, res) => {
  try {
    const { message } = req.body;
    const userData = req.auth
    console.log(userData)


    if (!message || !userData) {
      return res
        .status(400)
        .json({ error: error.message || "Message and user data are required" });
    }

    const response = await chatService(userData, message);
    if (!response) {
      return res.status(404).json({ error: "No response from chat service" });
    }
    if (response.error) {
      return res.status(400).json({ error: response.error });
    }
    
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in chatController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};
