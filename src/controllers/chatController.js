import { chatService } from "../services/chatService.js";

export   const chatController = async (req, res) => {
    try {

        const { message } = req.body;
        console.log("Received message:", message);
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const response = await chatService(message)
        res.status(200).json({ response: response});
    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }
}