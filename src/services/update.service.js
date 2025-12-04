import { openAi } from "../openAI/openAi.js";

export const updatePlanService = async (FitnessProfile, userMessage, currentPlan) => {
  let dynamicGoal = "";
  let planType = "full"; // can be 'daily' or 'update'

  // --- Step 1: Detect user intent ---
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes("today") && lowerMsg.includes("diet")) {
    planType = "daily";
  } else if (
    lowerMsg.includes("update") ||
    lowerMsg.includes("change") ||
    lowerMsg.includes("modify")
  ) {
    planType = "update";
  }

  if (lowerMsg.includes("non veg") || lowerMsg.includes("non-veg")) {
    dynamicGoal = "non-vegetarian";
  } else if (lowerMsg.includes("veg") || lowerMsg.includes("vegetarian")) {
    dynamicGoal = "vegetarian";
  }

  // --- Step 2: Prepare system prompt ---
  const systemPrompt = `
You are an intelligent AI fitness assistant.

User already has a fitness profile and a workout/diet plan.

Your job is to understand what user wants:

1. If user asks for "today's diet", create only today's meal plan according to their fitness profile goals (e.g., weight loss, muscle gain).
2. If user says "change/update workout or diet", modify only the requested part but keep the rest same.
3. If user mentions "veg" or "non-veg", generate accordingly.
4. Otherwise, generate the most suitable plan according to user's profile.

Always respond in this format:

${planType === "update" ? `
PREVIOUS COMPLETE FITNESS PLAN:
(workout + diet)

CHANGES MADE:
(list what was changed)

UPDATED COMPLETE FITNESS PLAN:
(workout + diet)
` : `
${planType === "daily" ? `
TODAY'S DIET PLAN:
(Breakfast, Lunch, Dinner, Snacks)
` : `
COMPLETE FITNESS PLAN:
(Workout + Diet for 7 days)
`}
`}

Keep it easy to read and practical. No technical words.
`;

  // --- Step 3: Build user prompt ---
  const userPrompt = `
User Profile:
${JSON.stringify(FitnessProfile, null, 2)}

Current Plan:
${JSON.stringify(currentPlan, null, 2)}

User Message:
"${userMessage}"

User prefers: ${dynamicGoal || "as per fitness profile"}
`;

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const aiText = response.choices[0].message.content;

    return {
      response: aiText,
      summary:
        planType === "daily"
          ? "Generated today's diet plan based on your fitness profile"
          : planType === "update"
          ? `Updated your fitness plan based on: "${userMessage}"`
          : "Generated a complete plan based on your fitness profile",
    };
  } catch (err) {
    console.error("❌ Error updating plan:", err);
    return { error: "Failed to update plan." };
  }
};
