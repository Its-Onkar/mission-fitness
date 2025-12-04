import mongoose from "mongoose";

const dailyActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now, required: true },
  
  // Daily Workout
  workoutPlan: {
    isGenerated: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    exercises: [{
      name: String,
      sets: String,
      reps: String,
      rest: String,
      notes: String,
      estimatedCalories: Number,
      completed: { type: Boolean, default: false }
    }],
    focus: String,
    totalCaloriesBurned: { type: Number, default: 0 },
    completedAt: Date
  },

  // Daily Diet
  dietPlan: {
    isGenerated: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    meals: {
      breakfast: { food: String, time: String, calories: Number, completed: { type: Boolean, default: false } },
      snack1: { food: String, time: String, calories: Number, completed: { type: Boolean, default: false } },
      lunch: { food: String, time: String, calories: Number, completed: { type: Boolean, default: false } },
      snack2: { food: String, time: String, calories: Number, completed: { type: Boolean, default: false } },
      dinner: { food: String, time: String, calories: Number, completed: { type: Boolean, default: false } }
    },
    waterIntake: String,
    totalCaloriesConsumed: { type: Number, default: 0 },
    completedAt: Date
  },

  // Progress Tracking
  streakCount: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Completed", "Partial"], default: "Pending" },
  motivation: String,

  // User Preferences for Next Day
  preferences: {
    workoutIntensity: { type: String, enum: ["light", "moderate", "intense"], default: "moderate" },
    mealComplexity: { type: String, enum: ["simple", "moderate", "complex"], default: "moderate" },
    skipWorkout: { type: Boolean, default: false },
    skipDiet: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Index for efficient queries
dailyActivitySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyActivity", dailyActivitySchema);