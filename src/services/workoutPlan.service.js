import { openAi } from "../oepnAI/openAi.js";



export const generatePlanFromAI = async (onboardingData) => {
  const prompt = `
  Create a personalized 7-day workout and diet plan for the following user:
  - Age: ${onboardingData.age}
  - Gender: ${onboardingData.gender}
  - Goal: ${onboardingData.fitnessGoal}
  - Weight: ${onboardingData.weight}kg
  - Height: ${onboardingData.height}cm
  - Activity Level: ${onboardingData.activityLevel}

  Respond ONLY with valid JSON inside a \`\`\`json code block like this:

  \`\`\`json
  {
    "workoutPlan": [
      { "day": "Monday", "exercises": ["Push-ups", "Squats", "Plank"] }
    ],
    "dietPlan": [
      { "day": "Monday", "meals": { "breakfast": "Oats", "lunch": "Chicken", "dinner": "Salad" } }
    ]
  }
  \`\`\`
  `.trim();

  try {
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content.trim();

    // ✅ Extract JSON block if present
    const match = aiResponse.match(/```json\s*([\s\S]*?)```/);
    const rawJson = match ? match[1].trim() : aiResponse;

    const parsed = JSON.parse(rawJson);
    return parsed;

  } catch (err) {
    console.error("❌ Failed to get or parse AI response:", err.message);
    throw new Error("AI returned invalid JSON. Try adjusting input and retry.");
  }
};