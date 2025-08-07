import { openAi } from "../oepnAI/openAi.js";

export const generateWorkoutPlanFromAI = async (onboardingData) => {
  const prompt = `
You are a certified personal trainer with experience in creating safe, realistic, and personalized plans.

Create a 7-day workout plan for the following user:

- Gender: ${onboardingData.gender}
- Age: ${onboardingData.age}
- Height: ${onboardingData.height} cm
- Weight: ${onboardingData.weight} kg
- Fitness Goal: ${onboardingData.fitnessGoal}
- Fitness Level: ${onboardingData.fitnessLevel}
- Activity Level: ${onboardingData.activityLevel}
- Workout Preference: ${onboardingData.workoutPreference}
- Available Equipment: ${onboardingData.availableEquipment?.length > 0 ? onboardingData.availableEquipment.join(', ') : 'None'}
- Preferred Workout Time: ${onboardingData.workoutTime}
- Exercise Frequency: ${onboardingData.exerciseFrequency?.timesPerWeek || ''} days/week (${onboardingData.exerciseFrequency?.preferredDays?.join(', ') || "no specific days"})
- Medical Conditions: ${onboardingData.medicalConditions?.length > 0 ? onboardingData.medicalConditions.join(', ') : 'None'}

Guidelines:
- Focus on user’s goal, fitness level, equipment, and preferences.
- Each day should have a warm-up (5–10 mins), workout, and cooldown.
- For each exercise, include sets, reps, rest time, and short notes.
- Avoid exercises that may worsen any medical condition.
- Plan must be safe, scalable, and motivating.

Respond ONLY with valid JSON inside a \`\`\`json code block like this:

Instructions:
- Create a workout plan for 7 days. Each day includes:
  - day (e.g., "Monday")
  - focus (e.g., "Upper Body", "Cardio", etc.)
  - exercises: A list of 2–5 exercises with the following fields:
    - name (string)
    - description (short, 1–2 sentences)
    - category (e.g., "strength", "cardio", "core", "mobility")
    - difficulty ("easy", "medium", "hard")
    - musclesTargeted (array of strings)
    - equipment (e.g., "dumbbells", "resistance bands", "bodyweight")
    - sets (e.g., "3")
    - reps (e.g., "12–15")
    - rest (e.g., "60 seconds")
    - notes (optional)
    - duration (in minutes)
    - estimatedCalories (kcal)

⚠️ Make sure exercises are safe considering medical conditions. Avoid duplicates across days.

Return ONLY valid JSON inside a markdown code block like this:

\`\`\`json
{
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "Full Body",
      "exercises": [
        {
          "name": "Push-ups",
          "description": "A bodyweight exercise targeting chest, shoulders, and triceps.",
          "category": "strength",
          "difficulty": "medium",
          "musclesTargeted": ["chest", "shoulders", "triceps"],
          "equipment": "bodyweight",
          "sets": "3",
          "reps": "12",
          "rest": "60 seconds",
          "notes": "Keep your core tight.",
          "duration": 10,
          "estimatedCalories": 50
        }
        // more exercises...
      ]
    }
    // Repeat for all 7 days
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
    const match = aiResponse.match(/```json\s*([\s\S]*?)```/);
    const rawJson = match ? match[1].trim() : aiResponse;

    const parsed = JSON.parse(rawJson);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to get or parse AI response:", err.message);
    throw new Error("AI returned invalid JSON. Try adjusting input and retry.");
  }
};

export const generateDietPlanFromAI = async (onboardingData) => {
  const prompt = `
You are a certified nutritionist with experience in building highly personalized meal plans.

Create a healthy, goal-oriented 7-day diet plan for this user:

- Gender: ${onboardingData.gender}
- Age: ${onboardingData.age}
- Height: ${onboardingData.height} cm
- Weight: ${onboardingData.weight} kg
- Fitness Goal: ${onboardingData.fitnessGoal}
- Activity Level: ${onboardingData.activityLevel}
- Diet Preference: ${onboardingData.dietPreference}
- Medical Conditions: ${onboardingData.medicalConditions?.length > 0 ? onboardingData.medicalConditions.join(', ') : 'None'}

Guidelines:
- Include 3 full meals (breakfast, lunch, dinner) and 1–2 snacks per day.
- Show portion sizes or approximate calories where useful.
- Respect user’s diet preference (e.g., ${onboardingData.dietPreference}) and avoid ingredients that may conflict with their conditions.
- Focus on whole foods, balanced macros, hydration, and long-term sustainability.

Respond ONLY with valid JSON inside a \`\`\`json code block like this:

\`\`\`json
{
  "dietPlan": [
    {
      "day": "Day 1",
      "meals": {
        "breakfast": "Oats with almond milk, banana, flax seeds (300 kcal)",
        "snack1": "Boiled eggs (2) or a protein bar",
        "lunch": "Grilled tofu/chicken with brown rice and mixed vegetables (500 kcal)",
        "snack2": "Fruit smoothie or Greek yogurt",
        "dinner": "Lentil soup with multigrain toast or grilled fish with sautéed greens"
      }
    }
    // Continue for 7 days
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
    const match = aiResponse.match(/```json\s*([\s\S]*?)```/);
    const rawJson = match ? match[1].trim() : aiResponse;

    const parsed = JSON.parse(rawJson);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to get or parse AI response:", err.message);
    throw new Error("AI returned invalid JSON. Try adjusting input and retry.");
  }
};
