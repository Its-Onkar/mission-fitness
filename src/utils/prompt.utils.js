import { openAi } from "../oepnAI/openAi.js";

export const getFitnessResponse = async (data, userMessage) => {
  // System prompt
  const systemPrompt = `
You are a smart, motivating AI fitness assistant. Help users with:
- Personalized workouts
- Diet & nutrition tips
- Health guidance
- Motivation
- Scheduling advice

Always tailor responses to the user’s info. Be accurate, supportive, and brief.
If the query is medical, advise consulting a professional.
If the question is not related to fitness, health, or diet, politely respond:
"I'm focused on fitness, health, and nutrition advice, so I may not be able to answer that."
Always return the output in JSON format with two fields: 
1) weeklyWorkoutPlan - object with days as keys and exercises as arrays
2) nutritionTips - array of strings
Do not return plain text.
`;

  // Fitness prompt
  const fullPrompt = `
User Info:
userId: ${data.userId}
gender: ${data.gender}
age: ${data.age}
height: ${data.height}
weight: ${data.weight}
fitnessGoal: ${data.fitnessGoal}
fitnessLevel: ${data.fitnessLevel}
activityLevel: ${data.activityLevel}
medicalConditions: ${data.medicalConditions}
dietPreference: ${data.dietPreference}
workoutPreference: ${data.workoutPreference}
availableEquipment: ${data.availableEquipment}
workoutTime: ${data.workoutTime}
exerciseFrequency: ${JSON.stringify(data.exerciseFrequency)}
plan: ${JSON.stringify(data.plan)}
permissions: ${JSON.stringify(data.permissions)}
firstGoal: ${data.firstGoal}
points: ${data.points}
onboardingStep: ${data.onboardingStep}
isComplete: ${data.isComplete}

User Message: ${userMessage}`;

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullPrompt },
      ],
    });

    const aiText = response.choices[0].message.content;

    // Parse AI response as JSON
    try {
      const jsonResponse = JSON.parse(aiText);
      return jsonResponse;
    } catch (parseError) {
      console.warn("AI did not return valid JSON, returning raw text");
      return { rawText: aiText };
    }
  } catch (error) {
    console.error("Error in getFitnessResponse:", error);
    throw new Error(`Failed to get chat response: ${error.message}`);
  }
};
