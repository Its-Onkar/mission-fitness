import WorkoutPlan from "../Schema/workout.schema.js";
import Exercise from "../Schema/exercise.schema.js";
import { generateWorkoutPlanFromAI } from "./aiPlans.service.js";

export const createWorkoutPlan = async (workoutData, userData) => {
    const { _id } = userData;
    const workoutGoal = workoutData.fitnessGoal || "general fitness";

    // Step 1: Create WorkoutPlan
    const workoutPlan = await WorkoutPlan.create({
        user: _id,
        goal: workoutGoal,
        startDate: new Date(),
        title: "7-Day AI Workout Plan",
    });

    // Step 2: Generate AI plan
    const aiResponse = await generateWorkoutPlanFromAI(workoutData);
  if (!aiResponse || !Array.isArray(aiResponse.workoutPlan)) {
  throw new Error("AI did not return a valid workoutPlan");
}

 const aiWorkoutPlan = aiResponse.workoutPlan;
    console.log("AI Workout Plan Response:", aiWorkoutPlan);
    

    // Step 3: Prepare Exercise entries
    const exercisesToCreate = [];

    for (const day of aiWorkoutPlan) {
        for (const exercise of day.exercises) {
            exercisesToCreate.push({
                planId: workoutPlan._id,
                user: _id,
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                rest: exercise.rest,
                notes: exercise.notes || "",
                day: day.day,
                createdByAI: true,

                description: exercise.description || "",
                difficulty: exercise.difficulty || "medium",
                equipment: exercise.equipment || "bodyweight",
                musclesTargeted: exercise.musclesTargeted || [],
            });
        }
    }

    await Exercise.insertMany(exercisesToCreate);
    workoutPlan.status = "in-progress";
    await workoutPlan.save();
     return workoutPlan;
};

export const getAllWorkoutPlans = async () => {
    const workoutPlans = await WorkoutPlan.find({}).populate("user", "name email");

    if (!workoutPlans || workoutPlans.length === 0) {
        throw new Error("No workout plans found");
    }
    return workoutPlans;
}

export const getWorkoutPlanByUserId = async (userId) => {
    const workoutPlan = await WorkoutPlan.findOne({ user: userId }).populate("user", "name email");
    if (!workoutPlan) {
        throw new Error("Workout plan not found for the user");
    }
    return workoutPlan;
}

export const updateWorkoutPlanByUserName = async (userName, updateData) => {
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(userName, updateData, {
        new: true,
        runValidators: true,
    }).populate("user", "name email");
    if (!workoutPlan) {
        throw new Error("Workout plan not found for the user");
    }
    return workoutPlan;
}   
