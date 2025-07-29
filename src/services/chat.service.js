import { openAi } from "../oepnAI/openAi.js";
import { fitnessprompt, systemPrompt } from "../utils/prompt.utils.js";


export const chatService = async (data,userMessage) => {
      const lowerMessage = userMessage.toLowerCase();
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
  const fullPrompt = fitnessprompt(data,userMessage);

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
    });

    console.log("OpenAI response:", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatService:", error);
    throw Error(`Failed to get chat response: ${error.message}`);
  }
}