import mongoose from "mongoose";
import fitnessProfileSchema from "../Schema/fitnessprofile.schema.js";
import workoutSchema from "../Schema/workout.schema.js";
import dietSchema from "../Schema/diet.schema.js";



export const createFitness = async (payload, userData) => {
  

  try {
    // 1️⃣ Create FitnessProfile
    const fitnessProfile = await fitnessProfileSchema.create([{
      user: userData._id,
      gender: payload.gender,
      age: payload.age,
      heightCm: payload.heightCm,
      weightKg: payload.weightKg,
      startWeight: payload.weightKg, // Set initial weight as start weight
      goal: payload.goal,
      fitnessLevel: payload.fitnessLevel,
      activityLevel: payload.activityLevel,
      workoutPreference: payload.workoutPreference,
      availableEquipment: payload.availableEquipment,
      preferredWorkoutTime: payload.preferredWorkoutTime,
      medicalConditions: payload.medicalConditions,
      dietPreference: payload.dietPreference,
      exerciseFrequency: payload.exerciseFrequency,
      permissions: payload.permissions,
      createdBy: userData._id
    }]);
      console.log("fitnessProfile:", fitnessProfile);
    const profile = fitnessProfile[0];
     console.log("Created FitnessProfile:", profile);
    // 2️⃣ Create workout plan based on user preferences
    let workoutRoutines = [];
    
    if (payload.goal === 'weight loss') {
      workoutRoutines = [
        {
          day: "Monday",
          exercises: [
            { name: "Cardio Running", sets: 1, reps: "30 min", duration: 30, caloriesBurn: 300 },
            { name: "Burpees", sets: 3, reps: 10, duration: 10, caloriesBurn: 100 }
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            { name: "HIIT Training", sets: 4, reps: "2 min", duration: 20, caloriesBurn: 250 }
          ]
        }
      ];
    } else if (payload.goal === 'muscle gain') {
      workoutRoutines = [
        {
          day: "Monday",
          exercises: [
            { name: "Push-ups", sets: 4, reps: 15, duration: 15, caloriesBurn: 80 },
            { name: "Pull-ups", sets: 3, reps: 8, duration: 10, caloriesBurn: 60 }
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            { name: "Squats", sets: 4, reps: 20, duration: 15, caloriesBurn: 120 },
            { name: "Deadlifts", sets: 3, reps: 12, duration: 12, caloriesBurn: 100 }
          ]
        }
      ];
    } else {
      workoutRoutines = [
        {
          day: "Monday",
          exercises: [
            { name: "Push-ups", sets: 3, reps: 12, duration: 8, caloriesBurn: 60 },
            { name: "Squats", sets: 3, reps: 15, duration: 10, caloriesBurn: 80 }
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            { name: "Light Cardio", sets: 1, reps: "20 min", duration: 20, caloriesBurn: 150 }
          ]
        }
      ];
    }
    
    const workoutPlan = await workoutSchema.create([{
      user: userData._id,
      fitnessProfile: profile._id,
      title: `${payload.goal} Workout Plan`,
      routines: workoutRoutines,
      goal: profile.goal
    }]);

    // 3️⃣ Create diet plan based on goal and preference
    let meals = [];
    
    if (payload.goal === 'weight loss') {
      if (payload.dietPreference === 'vegetarian') {
        meals = [
          { name: "Breakfast", items: [{ food: "Green smoothie with spinach", calories: 250, protein: 8, carbs: 35, fats: 5 }] },
          { name: "Lunch", items: [{ food: "Quinoa salad with vegetables", calories: 350, protein: 12, carbs: 50, fats: 8 }] },
          { name: "Dinner", items: [{ food: "Grilled vegetables with tofu", calories: 300, protein: 15, carbs: 25, fats: 12 }] }
        ];
      } else {
        meals = [
          { name: "Breakfast", items: [{ food: "Egg white omelet", calories: 200, protein: 20, carbs: 5, fats: 8 }] },
          { name: "Lunch", items: [{ food: "Grilled chicken breast with salad", calories: 350, protein: 35, carbs: 15, fats: 10 }] },
          { name: "Dinner", items: [{ food: "Baked fish with steamed broccoli", calories: 300, protein: 30, carbs: 10, fats: 8 }] }
        ];
      }
    } else if (payload.goal === 'muscle gain') {
      if (payload.dietPreference === 'vegetarian') {
        meals = [
          { name: "Breakfast", items: [{ food: "Protein smoothie with peanut butter", calories: 450, protein: 25, carbs: 40, fats: 18 }] },
          { name: "Lunch", items: [{ food: "Chickpea curry with quinoa", calories: 500, protein: 20, carbs: 70, fats: 15 }] },
          { name: "Dinner", items: [{ food: "Lentil dal with brown rice", calories: 480, protein: 22, carbs: 75, fats: 10 }] }
        ];
      } else {
        meals = [
          { name: "Breakfast", items: [{ food: "Scrambled eggs with whole grain toast", calories: 400, protein: 25, carbs: 35, fats: 18 }] },
          { name: "Lunch", items: [{ food: "Chicken breast with sweet potato", calories: 500, protein: 40, carbs: 50, fats: 12 }] },
          { name: "Dinner", items: [{ food: "Lean beef with quinoa", calories: 550, protein: 45, carbs: 40, fats: 20 }] }
        ];
      }
    } else {
      if (payload.dietPreference === 'vegetarian') {
        meals = [
          { name: "Breakfast", items: [{ food: "Oatmeal with berries and nuts", calories: 300, protein: 10, carbs: 50, fats: 8 }] },
          { name: "Lunch", items: [{ food: "Quinoa salad with chickpeas", calories: 400, protein: 15, carbs: 60, fats: 10 }] },
          { name: "Dinner", items: [{ food: "Vegetable stir-fry with tofu", calories: 350, protein: 18, carbs: 35, fats: 15 }] }
        ];
      } else {
        meals = [
          { name: "Breakfast", items: [{ food: "Oatmeal with berries", calories: 300, protein: 10, carbs: 50, fats: 5 }] },
          { name: "Lunch", items: [{ food: "Grilled chicken salad", calories: 400, protein: 30, carbs: 20, fats: 15 }] },
          { name: "Dinner", items: [{ food: "Baked salmon with vegetables", calories: 450, protein: 35, carbs: 25, fats: 20 }] }
        ];
      }
    }
    
    const dietPlan = await dietSchema.create([{
      userId: userData._id,
      dietPlan: profile.goal,
      dietDuration: "4 weeks",
      mealDetails: { meals: meals },
      status: "pending"
    }]);

    // 5️⃣ Update FitnessProfile with plan references
    await fitnessProfileSchema.updateOne(
      { _id: profile._id },
      {
        workoutPlan: workoutPlan[0]._id,
        dietPlan: dietPlan[0]._id,
        isComplete: true
      },
     
    );



    return {
      fitnessProfile: profile,
      workoutPlan: workoutPlan[0],
      dietPlan: dietPlan[0]
    };

  } catch (error) {
 
    throw new Error("Failed to create fitness profile: " + error.message);
  }
};
