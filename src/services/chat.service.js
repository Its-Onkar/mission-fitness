<<<<<<< Updated upstream
import { openAi } from "../oepnAI/openAi.js";
import { fitnessprompt, systemPrompt } from "../utils/prompt.utils.js";
=======
import { openAi } from "../openAI/openAi.js";
import {  getFitnessResponse } from "../utils/prompt.utils.js";
>>>>>>> Stashed changes


export const chatService = async (data,userMessage) => {
      const lowerMessage = userMessage.toLowerCase();
    const allowedKeywords = [
      "fitness", "diet", "workout", "exercise", "yoga", "plan",
      "nutrition", "health", "pose", "routine", "fat", "muscle", "calorie",
      "weight", "food", "vegetable", "fruit", "protein", "carb", "vitamin",
      "meal", "eating", "hungry", "lose", "gain", "body", "energy", "sleep",
      "water", "hydration", "supplement", "recipe", "cook", "ingredient"
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

<<<<<<< Updated upstream
    console.log("OpenAI response:", response);
    return response.choices[0].message.content;
=======
    const aiText = response.choices[0].message.content;

    // Parse JSON response
    try {
      const jsonResponse = JSON.parse(aiText);

      // Ensure schema-compatible keys
      if (!jsonResponse.weeklyWorkoutPlan) jsonResponse.weeklyWorkoutPlan = {};
      if (!jsonResponse.nutritionTips) jsonResponse.nutritionTips = [];

      // Map JSON to schema format
      const workoutPlanData = {
        title: "7-Day AI Workout Plan",
        routines: Object.entries(jsonResponse.weeklyWorkoutPlan).map(  
          ([day, exercises]) => ({
            day,
            exercises: exercises.map((ex) => ({
              name: ex.name || "",
              sets: ex.sets || 3,
              reps: ex.reps || 12,
              duration: ex.duration || 30,
              caloriesBurn: ex.caloriesBurn || 0
            })),
          })
        ),
      };

      const dietPlanData = {
        meals: jsonResponse.nutritionTips.map((meal) => ({
          name: meal.name,
          items: meal.items.map((item) => ({
            food: item.food,
            calories: item.calories,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fats: item.fats || 0,
          })),
        })),
      };

      return { workoutPlanData, dietPlanData };
    } catch (parseError) {
      console.warn("AI did not return valid JSON, returning raw text");
      return { rawText: aiText };
    }
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error in chatService:", error);
    throw Error(`Failed to get chat response: ${error.message}`);
  }
}