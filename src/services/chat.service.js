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

export const getFitnessResponses = async (fitnessProfile, userMessage) => {
  const systemPrompt = `
You are a smart AI fitness assistant. Based on the user's fitness profile:
1) Provide weeklyWorkoutPlan: an object with keys as days ("Monday"-"Sunday") and value as array of exercises.
   Each exercise includes: name, sets, reps, duration (minutes), caloriesBurn
2) Provide nutritionTips: array of meals with details { name: Breakfast/Lunch/Dinner, items: [{ food, calories, protein, carbs, fats }] }
Return JSON only, matching the structure of WorkoutPlan and DietPlan schemas.
`;

  const userPrompt = `
User Profile:
- Gender: ${fitnessProfile.gender}
- Age: ${fitnessProfile.age}
- Height: ${fitnessProfile.heightCm} cm
- Weight: ${fitnessProfile.weightKg} kg
- Fitness Goal: ${fitnessProfile.goal}
- Fitness Level: ${fitnessProfile.fitnessLevel}
- Activity Level: ${fitnessProfile.activityLevel}
- Workout Preference: ${fitnessProfile.workoutPreference}
- Available Equipment: ${fitnessProfile.availableEquipment.join(", ")}
- Preferred Workout Time: ${fitnessProfile.preferredWorkoutTime}
- Medical Conditions: ${fitnessProfile.medicalConditions.join(", ")}
- Diet Preference: ${fitnessProfile.dietPreference}
- Exercise Frequency: ${fitnessProfile.exerciseFrequency.timesPerWeek} days/week (${fitnessProfile.exerciseFrequency.preferredDays.join(", ")})
User Message: ${userMessage}
`;

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

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
  } catch (error) {
    console.error("Error in getFitnessResponse:", error);
    throw new Error(`Failed to get AI fitness response: ${error.message}`);
  }
};
