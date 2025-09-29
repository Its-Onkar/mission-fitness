import { openAi } from "../oepnAI/openAi.js";
import {  getFitnessResponse } from "../utils/prompt.utils.js";


export const chatService = async (data,userMessage) => {
      const lowerMessage = userMessage.toLowerCase();
      console.log("User message:", userMessage);
    const allowedKeywords = [
      "fitness", "diet", "workout", "exercise", "yoga", "plan",
      "nutrition", "health", "pose", "routine", "fat", "muscle", "calorie"
    ];

    const isRelevant = allowedKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (!isRelevant) {
      return "❌ Sorry, I can only help with fitness, health, or diet-related questions.";
    }
   const mydata=await getFitnessResponse(data,userMessage);
   
   console.log("AI response:", mydata);

   return mydata;
}

