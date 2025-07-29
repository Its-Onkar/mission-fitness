import { openAi } from "../oepnAI/openAi.js"; 

export const generatePlanFromAI = async (onboardingData) => {
  const prompt = `
  Create a personalized 7-day workout and diet plan for the following user:
  Age: ${onboardingData.age}
  Gender: ${onboardingData.gender}
  Goal: ${onboardingData.fitnessGoal}
  Weight: ${onboardingData.weight}kg
  Height: ${onboardingData.height}cm
  Activity Level: ${onboardingData.activityLevel}

  Respond in JSON format:
  {
    "workoutPlan": [...],
    "dietPlan": [...]
  }
  `;

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const result = completion.choices[0].message.content;
  return JSON.parse(result); 
};
