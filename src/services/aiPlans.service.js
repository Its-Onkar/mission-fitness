import { openAi } from "../openAI/openAi.js";
import { enhanceDietPlanWithUSDA } from "./usda.service.js";

<<<<<<< Updated upstream
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
=======
const getUserSeed = (fitnessProfile) => {
  const str = JSON.stringify(fitnessProfile);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
>>>>>>> Stashed changes
  }
  return Math.abs(hash % 1000) / 1000;
};

export const generateDietPlanFromAI = async (fitnessProfile) => {
  console.log('Generating diet plan for preference:', fitnessProfile.dietPreference);
  console.log('Fitness goal:', fitnessProfile.goal);

  if (!fitnessProfile.dietPreference) {
    fitnessProfile.dietPreference = 'none';
  }

  const goalCalorieAdjustment = {
    'weight loss': 0.8,
    'fat loss': 0.8,
    'maintenance': 1.0,
    'balanced': 1.0,
    'muscle gain': 1.3,
    'weight gain': 1.3,
    'strength': 1.2,
    'endurance': 1.1
  }[fitnessProfile.goal?.toLowerCase()] || 1.0;

  const baseCaloricNeeds = fitnessProfile.gender === 'male' 
    ? 2200 + (fitnessProfile.weightKg * 10) 
    : 1800 + (fitnessProfile.weightKg * 8);
  
  const targetCalories = Math.round(baseCaloricNeeds * goalCalorieAdjustment);

  const getDietRestrictions = () => {
    const pref = fitnessProfile.dietPreference?.toLowerCase();
    if (pref === 'vegetarian') return 'NO meat, fish, chicken, seafood, poultry of any kind. Use vegetables, dairy, eggs, grains, legumes only.';
    if (pref === 'vegan') return 'NO animal products - no meat, fish, dairy, eggs, honey. Use only plant-based foods.';
    if (pref === 'keto') return 'High fat, very low carb. NO bread, rice, pasta, sugar, fruits.';
    if (pref === 'paleo') return 'NO processed foods, grains, dairy, legumes. Use meat, fish, vegetables, fruits, nuts.';
    if (pref === 'gluten-free') return 'NO wheat, barley, rye, gluten-containing foods.';
    return 'All foods allowed including meat and fish.';
  };

  const prompt = `Create a personalized 7-day diet plan for:
- Gender: ${fitnessProfile.gender}
- Age: ${fitnessProfile.age}
- Weight: ${fitnessProfile.weightKg}kg
- Goal: ${fitnessProfile.goal} (Target: ${targetCalories} calories/day)
- Diet Preference: ${fitnessProfile.dietPreference}
- Activity Level: ${fitnessProfile.activityLevel}

CRITICAL DIET RESTRICTIONS:
${getDietRestrictions()}

STRICT REQUIREMENTS:
1. ABSOLUTELY MUST follow diet restrictions above - NO exceptions
2. Target ${targetCalories} calories per day for ${fitnessProfile.goal}
3. Distribute calories: Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
4. Include water intake: ${Math.round(fitnessProfile.weightKg * 35)}ml based on body weight
5. Focus on ${fitnessProfile.goal}-specific nutrition

Return ONLY valid JSON:
{
  "dietPlan": [
    {
      "day": "Day 1",
      "waterIntake": "${Math.round(fitnessProfile.weightKg * 35)}ml",
      "totalCalories": ${targetCalories},
      "meals": {
        "breakfast": {"item": "meal (calories)", "time": "8:00 AM"},
        "snack1": {"item": "meal (calories)", "time": "11:00 AM"},
        "lunch": {"item": "meal (calories)", "time": "1:30 PM"},
        "snack2": {"item": "meal (calories)", "time": "5:00 PM"},
        "dinner": {"item": "meal (calories)", "time": "8:00 PM"}
      }
    }
  ]
}`;

  try {
    console.time("Diet Plan Generation");
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert nutritionist who builds personalized diet plans." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8 + getUserSeed(fitnessProfile) * 0.2,
      max_tokens: 2000,
    });
    console.timeEnd("Diet Plan Generation");

    const aiResponse = completion.choices[0].message.content.trim();
    let rawJson = aiResponse;
    const match = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) rawJson = match[1].trim();
    rawJson = rawJson.replace(/^```json?\s*|```\s*$/g, "").trim();
    rawJson = rawJson.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseError) {
      console.error("Diet JSON Parse Error:", parseError.message);
      const waterIntake = fitnessProfile.weightKg
        ? `${Math.round(fitnessProfile.weightKg * 35)}ml (based on body weight)`
        : "2500ml (based on body weight)";

      const getFallbackMeals = () => {
        const dietPref = fitnessProfile.dietPreference?.toLowerCase() || 'none';
        const goal = fitnessProfile.goal?.toLowerCase() || 'maintenance';
        
        const calorieMultiplier = {
          'weight loss': 0.8,
          'maintenance': 1.0,
          'balanced': 1.0,
          'muscle gain': 1.3,
          'weight gain': 1.3
        }[goal] || 1.0;
        
        const adjustCalories = (base) => Math.round(base * calorieMultiplier);
        
        if (dietPref === 'vegan') {
          return {
            breakfast: { item: `Oatmeal with berries and almond milk (${adjustCalories(300)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Mixed nuts and seeds (${adjustCalories(150)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Quinoa bowl with vegetables and chickpeas (${adjustCalories(400)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Hummus with vegetables (${adjustCalories(200)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Lentil curry with brown rice (${adjustCalories(350)} kcal)`, time: "8:00 PM" },
          };
        } else if (dietPref === 'vegetarian') {
          return {
            breakfast: { item: `Oatmeal with fruits and nuts (${adjustCalories(300)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Greek yogurt with honey (${adjustCalories(150)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Vegetable pasta with cheese (${adjustCalories(400)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Cottage cheese with fruits (${adjustCalories(200)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Vegetable curry with rice (${adjustCalories(350)} kcal)`, time: "8:00 PM" },
          };
        } else if (dietPref === 'keto') {
          return {
            breakfast: { item: `Avocado and cheese omelet (${adjustCalories(350)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Macadamia nuts (${adjustCalories(200)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Grilled salmon with leafy greens (${adjustCalories(450)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Cheese and olives (${adjustCalories(150)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Beef steak with broccoli (${adjustCalories(400)} kcal)`, time: "8:00 PM" },
          };
        } else if (dietPref === 'paleo') {
          return {
            breakfast: { item: `Sweet potato hash with eggs (${adjustCalories(300)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Mixed berries and nuts (${adjustCalories(150)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Grilled chicken with vegetables (${adjustCalories(400)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Apple with almond butter (${adjustCalories(200)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Baked fish with roasted vegetables (${adjustCalories(350)} kcal)`, time: "8:00 PM" },
          };
        } else if (dietPref === 'gluten-free') {
          return {
            breakfast: { item: `Gluten-free oats with fruits (${adjustCalories(300)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Rice cakes with peanut butter (${adjustCalories(150)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Quinoa salad with grilled chicken (${adjustCalories(400)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Greek yogurt with berries (${adjustCalories(200)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Grilled fish with rice and vegetables (${adjustCalories(350)} kcal)`, time: "8:00 PM" },
          };
        } else {
          return {
            breakfast: { item: `Scrambled eggs with toast (${adjustCalories(300)} kcal)`, time: "8:00 AM" },
            snack1: { item: `Greek yogurt (${adjustCalories(150)} kcal)`, time: "11:00 AM" },
            lunch: { item: `Grilled chicken salad (${adjustCalories(400)} kcal)`, time: "1:30 PM" },
            snack2: { item: `Mixed nuts (${adjustCalories(200)} kcal)`, time: "5:00 PM" },
            dinner: { item: `Baked fish with vegetables (${adjustCalories(350)} kcal)`, time: "8:00 PM" },
          };
        }
      };

      parsed = {
        dietPlan: Array.from({ length: 7 }, (_, i) => ({
          day: `Day ${i + 1}`,
          waterIntake: waterIntake,
          meals: getFallbackMeals(),
          nutritionProgress: {
            streakCount: 1,
            status: "Pending",
            motivation: "Eat well today to keep your streak alive 🥗",
          },
        })),
      };
    }

    const validateDietPreference = (plan) => {
      const dietPref = fitnessProfile.dietPreference?.toLowerCase() || 'none';
      
      plan.dietPlan.forEach((day, dayIndex) => {
        Object.keys(day.meals).forEach(mealType => {
          const meal = day.meals[mealType];
          const mealText = typeof meal === 'string' ? meal : meal.item || '';
          
          let needsReplacement = false;
          let replacement = '';
          
          if (dietPref === 'vegetarian') {
            const nonVegWords = ['salmon', 'fish', 'chicken', 'beef', 'pork', 'meat', 'seafood', 'shrimp', 'tuna', 'turkey', 'bacon', 'ham', 'egg'];
            needsReplacement = nonVegWords.some(word => mealText.toLowerCase().includes(word));
            
            if (needsReplacement) {
              const vegAlternatives = {
                breakfast: "Oatmeal with fruits and nuts (300 kcal)",
                snack1: "Greek yogurt with berries (150 kcal)",
                lunch: "Vegetable pasta with cheese (400 kcal)",
                snack2: "Hummus with vegetables (200 kcal)",
                dinner: "Vegetable stir-fry with paneer (350 kcal)"
              };
              replacement = vegAlternatives[mealType] || "Vegetarian meal (300 kcal)";
            }
          }
          
          if (dietPref === 'vegan') {
            const nonVegWords = ['salmon', 'fish', 'chicken', 'beef', 'pork', 'meat', 'seafood', 'shrimp', 'tuna', 'turkey', 'bacon', 'ham'];
            needsReplacement = nonVegWords.some(word => mealText.toLowerCase().includes(word));
            
            if (needsReplacement) {
              const veganAlternatives = {
                breakfast: "Oatmeal with berries and almond milk (300 kcal)",
                snack1: "Mixed nuts and seeds (150 kcal)",
                lunch: "Quinoa bowl with vegetables and chickpeas (400 kcal)",
                snack2: "Hummus with vegetables (200 kcal)",
                dinner: "Lentil curry with brown rice (350 kcal)"
              };
              replacement = veganAlternatives[mealType] || "Vegan meal (300 kcal)";
            }
          }
          
          if (dietPref === 'keto') {
            const nonKetoWords = ['bread', 'rice', 'pasta', 'potato', 'sugar', 'fruit', 'oats', 'quinoa', 'beans', 'lentils'];
            needsReplacement = nonKetoWords.some(word => mealText.toLowerCase().includes(word));
            
            if (needsReplacement) {
              const ketoAlternatives = {
                breakfast: "Avocado and cheese omelet (350 kcal)",
                snack1: "Macadamia nuts (200 kcal)",
                lunch: "Grilled salmon with leafy greens (450 kcal)",
                snack2: "Cheese and olives (150 kcal)",
                dinner: "Beef steak with broccoli (400 kcal)"
              };
              replacement = ketoAlternatives[mealType] || "Keto meal (300 kcal)";
            }
          }
          
          if (dietPref === 'paleo') {
            const nonPaleoWords = ['bread', 'rice', 'pasta', 'dairy', 'beans', 'lentils', 'peanut', 'sugar', 'processed'];
            needsReplacement = nonPaleoWords.some(word => mealText.toLowerCase().includes(word));
            
            if (needsReplacement) {
              const paleoAlternatives = {
                breakfast: "Sweet potato hash with eggs (300 kcal)",
                snack1: "Mixed berries and nuts (150 kcal)",
                lunch: "Grilled chicken with vegetables (400 kcal)",
                snack2: "Apple with almond butter (200 kcal)",
                dinner: "Baked fish with roasted vegetables (350 kcal)"
              };
              replacement = paleoAlternatives[mealType] || "Paleo meal (300 kcal)";
            }
          }
          
          if (dietPref === 'gluten-free') {
            const glutenWords = ['wheat', 'bread', 'pasta', 'barley', 'rye', 'gluten'];
            needsReplacement = glutenWords.some(word => mealText.toLowerCase().includes(word));
            
            if (needsReplacement) {
              const gfAlternatives = {
                breakfast: "Gluten-free oats with fruits (300 kcal)",
                snack1: "Rice cakes with peanut butter (150 kcal)",
                lunch: "Quinoa salad with grilled chicken (400 kcal)",
                snack2: "Greek yogurt with berries (200 kcal)",
                dinner: "Grilled fish with rice and vegetables (350 kcal)"
              };
              replacement = gfAlternatives[mealType] || "Gluten-free meal (300 kcal)";
            }
          }
          
          if (dietPref === 'vegan') {
            const nonVeganWords = ['egg', 'dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'honey'];
            if (nonVeganWords.some(word => mealText.toLowerCase().includes(word))) {
              needsReplacement = true;
              const veganAlternatives = {
                breakfast: "Oatmeal with berries and almond milk (300 kcal)",
                snack1: "Mixed nuts and seeds (150 kcal)",
                lunch: "Quinoa bowl with vegetables and chickpeas (400 kcal)",
                snack2: "Hummus with vegetables (200 kcal)",
                dinner: "Lentil curry with brown rice (350 kcal)"
              };
              replacement = veganAlternatives[mealType] || "Vegan meal (300 kcal)";
            }
          }
          
          if (needsReplacement) {
            console.log(`Day ${dayIndex + 1} - Replacing: ${mealText} -> ${replacement}`);
            if (typeof meal === 'string') {
              day.meals[mealType] = replacement;
            } else {
              day.meals[mealType].item = replacement;
            }
          }
        });
      });
      
      return plan;
    };
    
    parsed = validateDietPreference(parsed);

    try {
      console.log("🔍 Enhancing diet plan with USDA data...");
      const enhancedPlan = await enhanceDietPlanWithUSDA(parsed);
      return enhancedPlan;
    } catch (usdaError) {
      console.log("⚠️ USDA enhancement failed, returning basic plan");
      return parsed;
    }
  } catch (err) {
    console.error("❌ Failed to get or parse AI response:", err.message);
    throw new Error("AI returned invalid JSON for diet plan.");
  }
};

export const generateWorkoutPlanFromAI = async (fitnessProfile) => {
  const getWorkoutSchedule = () => {
    const schedules = {
      'beginner': { frequency: 3, duration: '30-45 min', restDays: 2 },
      'intermediate': { frequency: 4, duration: '45-60 min', restDays: 1 },
      'advanced': { frequency: 5, duration: '60-90 min', restDays: 1 }
    };
    return schedules[fitnessProfile.fitnessLevel?.toLowerCase()] || schedules.beginner;
  };

  const schedule = getWorkoutSchedule();
  
  const goalSpecificFocus = {
    'weight loss': 'High-intensity cardio, circuit training, fat burning',
    'fat loss': 'HIIT, cardio intervals, metabolic training',
    'muscle gain': 'Progressive overload, compound movements, hypertrophy',
    'weight gain': 'Strength training, compound lifts, muscle building',
    'strength': 'Heavy compound lifts, powerlifting movements',
    'endurance': 'Cardio intervals, stamina building, aerobic training',
    'maintenance': 'Balanced strength and cardio',
    'balanced': 'Full body workouts, varied training'
  }[fitnessProfile.goal?.toLowerCase()] || 'Balanced training';

  const prompt = `Create a 7-day workout plan for:
- Gender: ${fitnessProfile.gender}
- Goal: ${fitnessProfile.goal} (Focus: ${goalSpecificFocus})
- Fitness Level: ${fitnessProfile.fitnessLevel} (${schedule.frequency}x/week, ${schedule.duration})
- Workout Preference: ${fitnessProfile.workoutPreference}
- Available Time: ${schedule.duration} per session

STRICT REQUIREMENTS:
1. Design for ${fitnessProfile.goal} with ${goalSpecificFocus}
2. Match ${fitnessProfile.fitnessLevel} intensity and volume
3. Include ${fitnessProfile.workoutPreference} exercises when possible
4. Provide proper rest days and recovery
5. Include warm-up and cool-down
6. Estimate calories burned per exercise

Return ONLY valid JSON:
{
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "Upper Body",
      "duration": "${schedule.duration}",
      "intensity": "${fitnessProfile.fitnessLevel}",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": "3",
          "reps": "12",
          "rest": "60 sec",
          "notes": "Form tips",
          "estimatedCalories": 50
        }
      ],
      "totalCaloriesBurned": 300,
      "dailyProgress": {
        "streakCount": 1,
        "status": "Pending",
        "motivation": "Start strong! 💪"
      }
    }
  ]
}`;

  try {
    console.time("Workout Plan Generation");
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert personal trainer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6 + getUserSeed(fitnessProfile) * 0.4,
      max_tokens: 1500,
    });
    console.timeEnd("Workout Plan Generation");

    const aiResponse = completion.choices[0].message.content.trim();
    let rawJson = aiResponse;
    const match = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) rawJson = match[1].trim();
    rawJson = rawJson.replace(/^```json?\s*|```\s*$/g, "").trim();
    rawJson = rawJson.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    try {
      const parsed = JSON.parse(rawJson);
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      return {
        workoutPlan: [
          {
            day: "Monday",
            focus: "Full Body",
            exercises: [
              {
                name: "Push-ups",
                sets: "3",
                reps: "12",
                rest: "60 sec",
                notes: "Keep core tight",
                estimatedCalories: 50,
              },
            ],
            dailyProgress: {
              streakCount: 1,
              status: "Pending",
              motivation: "Start strong! Every day adds to your streak 💪",
            },
          },
        ],
      };
    }
  } catch (err) {
    console.error("❌ Failed to get or parse AI response:", err.message);
    throw new Error("AI returned invalid JSON for workout plan.");
  }
};

export const generateDailyDietPlan = async (fitnessProfile, dayName) => {
  console.log(`Generating daily diet plan for ${dayName}`);
  
  const targetCalories = Math.round((fitnessProfile.gender === 'male' ? 2500 : 2000) * 
    (fitnessProfile.goal === 'muscle gain' ? 1.2 : fitnessProfile.goal === 'weight loss' ? 0.8 : 1.0));

  const prompt = `Create a 1-day diet plan for ${dayName} for:
- Goal: ${fitnessProfile.goal} (Target: ${targetCalories} kcal)
- Diet Preference: ${fitnessProfile.dietPreference || 'none'}
- Allergies/Conditions: ${fitnessProfile.medicalConditions?.join(', ') || 'none'}

STRICT REQUIREMENTS:
1. Provide specific meals for Breakfast, Snack 1, Lunch, Snack 2, Dinner
2. Include calorie counts for each meal
3. Total calories must be close to ${targetCalories}
4. Respect diet preference: ${fitnessProfile.dietPreference || 'none'}

Return ONLY valid JSON:
{
  "meals": {
    "breakfast": {"item": "meal name", "calories": 500, "time": "8:00 AM"},
    "snack1": {"item": "snack name", "calories": 200, "time": "11:00 AM"},
    "lunch": {"item": "meal name", "calories": 700, "time": "1:30 PM"},
    "snack2": {"item": "snack name", "calories": 200, "time": "5:00 PM"},
    "dinner": {"item": "meal name", "calories": 600, "time": "8:00 PM"}
  },
  "waterIntake": "2500ml"
}`;

  try {
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert nutritionist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9, // Higher temperature for variety
    });

    const aiResponse = completion.choices[0].message.content.trim();
    let rawJson = aiResponse.replace(/^```json?\s*|```\s*$/g, "").trim();
    
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Daily Diet Gen Error:", error);
    // Fallback
    return {
      meals: {
        breakfast: { item: "Oatmeal with berries", calories: 300, time: "8:00 AM" },
        snack1: { item: "Apple", calories: 100, time: "11:00 AM" },
        lunch: { item: "Grilled Chicken Salad", calories: 500, time: "1:30 PM" },
        snack2: { item: "Almonds", calories: 150, time: "5:00 PM" },
        dinner: { item: "Baked Salmon with Veggies", calories: 450, time: "8:00 PM" }
      },
      waterIntake: "2500ml"
    };
  }
};

import DailyPlan from "../Schema/dailyPlan.schema.js";

export const getOrCreateDailyPlan = async (userId, fitnessProfile) => {
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Check if plan exists for today
  let dailyPlan = await DailyPlan.findOne({ user: userId, date: today });
  
  if (dailyPlan) {
    console.log(`✅ Found existing daily plan for ${today}`);
    return dailyPlan;
  }

  console.log(`✨ Generating NEW daily plan for ${today}`);

    try {
    // 2. Generate Plan via AI (Parallel)
    const [workoutData, dietData] = await Promise.all([
      (async () => {
        const prompt = `Create a complete daily fitness plan for:
- Age: ${fitnessProfile.age}
- Gender: ${fitnessProfile.gender}
- BMI: ${(fitnessProfile.weightKg / ((fitnessProfile.heightCm/100)**2)).toFixed(1)}
- Goal: ${fitnessProfile.goal}
- Level: ${fitnessProfile.fitnessLevel}
- Equipment: ${fitnessProfile.availableEquipment?.join(', ') || 'None'}
- Injuries: ${fitnessProfile.medicalConditions?.join(', ') || 'None'}

STRICT JSON OUTPUT REQUIRED:
{
  "workout": {
    "intensity": "Low/Medium/High",
    "caloriesTarget": 300,
    "warmup": [{"name": "Jumping Jacks", "duration": "2 mins", "notes": "Steady pace"}],
    "main": [{"name": "Pushups", "sets": "3", "reps": "12", "rest": "60s", "notes": "Keep core tight"}],
    "cooldown": [{"name": "Stretching", "duration": "5 mins", "notes": "Hold each stretch 20s"}],
    "tips": ["Drink water", "Focus on form"]
  },
  "activity": {
    "type": "Yoga/Running/Cycling/Walking/Sports",
    "duration": "30 mins",
    "goal": "Relaxation / 5km / 10k steps",
    "calories": 150
  }
}`;
        const completion = await openAi.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an elite personal trainer. Generate varied, safe, and effective daily plans." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        });
        const aiResponse = completion.choices[0].message.content.trim();
        let rawJson = aiResponse.replace(/^```json?\s*|```\s*$/g, "").trim();
        return JSON.parse(rawJson);
      })(),
      generateDailyDietPlan(fitnessProfile, new Date().toLocaleDateString('en-US', { weekday: 'long' }))
    ]);

    // 3. Save to DB
    dailyPlan = new DailyPlan({
      user: userId,
      date: today,
      workout: workoutData.workout,
      activity: workoutData.activity,
      diet: {
        meals: dietData.meals,
        waterIntake: dietData.waterIntake,
        totalCalories: Object.values(dietData.meals).reduce((acc, meal) => acc + (meal.calories || 0), 0)
      },
      status: 'pending'
    });

    await dailyPlan.save();
    console.log("💾 Saved new daily plan to DB");
    
    return dailyPlan;

  } catch (error) {
    console.error("❌ Daily Plan Generation Error:", error);
    // Return a safe fallback plan if AI fails
    return {
      workout: {
        intensity: "Low",
        caloriesTarget: 150,
        warmup: [{ name: "Walking", duration: "5 mins", notes: "Warm up body" }],
        main: [{ name: "Squats", sets: "3", reps: "10", rest: "60s", notes: "Bodyweight" }],
        cooldown: [{ name: "Stretch", duration: "5 mins", notes: "Gentle stretching" }],
        tips: ["Stay active!", "Hydrate"]
      },
      activity: {
        type: "Walking",
        duration: "20 mins",
        goal: "2000 steps",
        calories: 100
      }
    };
  }
};

export const generateDailyWorkoutPlan = async (fitnessProfile, dayName) => {
  // ... (keep existing function if needed, or deprecate)
  console.log(`Generating daily workout plan for ${dayName}`);
  // ... existing logic ...
  // For now, I'll keep the existing logic below as a fallback or for specific day requests
  // but the main dashboard will use getOrCreateDailyPlan
  
  const prompt = `Create a 1-day workout plan for ${dayName} for:
- Goal: ${fitnessProfile.goal}
- Level: ${fitnessProfile.fitnessLevel}
- Location: ${fitnessProfile.workoutPreference || 'home'}
- Equipment: ${fitnessProfile.availableEquipment?.join(', ') || 'none'}

STRICT REQUIREMENTS:
1. Focus on a specific muscle group or type suitable for ${dayName} (e.g., Monday=Chest/Push, Wednesday=Legs)
2. 5-6 exercises
3. Include sets, reps, and estimated calories burned

Return ONLY valid JSON:
{
  "focus": "Target Muscle/Type",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": "3",
      "reps": "12",
      "rest": "60s",
      "notes": "Form tip",
      "estimatedCalories": 50
    }
  ],
  "totalCaloriesBurned": 300
}`;

  try {
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert personal trainer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    });

    const aiResponse = completion.choices[0].message.content.trim();
    let rawJson = aiResponse.replace(/^```json?\s*|```\s*$/g, "").trim();
    
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Daily Workout Gen Error:", error);
    return {
      focus: "Full Body",
      exercises: [
        { name: "Push-ups", sets: "3", reps: "15", rest: "60s", notes: "Keep core tight", estimatedCalories: 50 },
        { name: "Squats", sets: "3", reps: "20", rest: "60s", notes: "Back straight", estimatedCalories: 60 },
        { name: "Plank", sets: "3", reps: "45s", rest: "60s", notes: "Hold steady", estimatedCalories: 30 }
      ],
      totalCaloriesBurned: 140
    };
  }
};