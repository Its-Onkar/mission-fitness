export const fitnessprompt = (data, userMessage) => {
  return `
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
};
export const systemPrompt = `
You are a smart, motivating AI fitness assistant. Help users with:
- Personalized workouts
- Diet & nutrition tips
- Health guidance
- Motivation
- Scheduling advice

Always tailor responses to the user’s info. Be accurate, supportive, and brief.
If the query is medical, advise consulting a professional.
If the question is not related to these topics, respond with:
"❌ Sorry, I can only help with fitness, health, or diet-related questions."
Do not answer general knowledge or unrelated queries
`;