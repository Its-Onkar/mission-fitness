import { openAi } from "../oepnAI/openAi.js";

export const chatService = async (messages) => {
  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: messages, 
        },
      ],
    });

    console.log("OpenAI response:", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatService:", error);
    throw error;
  }
}