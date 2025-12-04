import { openAi } from "../openAI/openAi.js";

export const getFitnessResponse = async (data, userMessage) => {
  // System prompt
  const systemPrompt = `
You are a smart, motivating AI fitness and nutrition assistant. You help users with:
- Personalized workouts and exercise plans
- Diet, nutrition, and healthy eating advice
- Food recommendations and meal planning
- Weight loss and weight gain strategies
- Health and wellness guidance
- Motivation and lifestyle tips

You are an expert in fitness, nutrition, and healthy living. Answer ALL questions related to:
- Exercise, workouts, yoga, sports
- Food, vegetables, fruits, proteins, carbs
- Diets, meal plans, recipes, cooking
- Weight management, muscle building, fat loss
- Vitamins, supplements, hydration
- Sleep, recovery, energy levels

Always provide helpful, accurate, and supportive answers. Be conversational and friendly.
If the query is medical or requires professional diagnosis, advise consulting a healthcare professional.

IMPORTANT: 
- For general questions about food, nutrition, vegetables, etc., provide clear, helpful text responses
- ONLY return JSON format with weeklyWorkoutPlan and nutritionTips when user explicitly asks for a complete workout plan or diet plan
- For all other questions, return plain conversational text
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

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullPrompt },
      ],
    });

    const aiText = response.choices[0].message.content;

    // Try to parse as JSON first
    try {
      const jsonResponse = JSON.parse(aiText);
      // If it's valid JSON with workout/nutrition data, return it
      if (jsonResponse.weeklyWorkoutPlan || jsonResponse.nutritionTips) {
        return jsonResponse;
      }
      // Otherwise return as plain text
      return { rawText: aiText };
    } catch (parseError) {
      // Not JSON, return as plain text
      return { rawText: aiText };
    }
  } catch (error) {
    console.error("Error in getFitnessResponse:", error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    }
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a moment.');
    }
    if (error.code === 'invalid_api_key') {
      throw new Error('OpenAI API key is invalid.');
    }
    if (error.message.includes('timeout')) {
      throw new Error('OpenAI API request timed out. Please try again.');
    }
    
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};