import mongoose from "mongoose";

const dailyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  
  workout: {
    intensity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    caloriesTarget: { type: Number },
    warmup: [{
      name: { type: String },
      duration: { type: String },
      notes: { type: String }
    }],
    main: [{
      name: { type: String },
      sets: { type: String },
      reps: { type: String },
      rest: { type: String },
      notes: { type: String }
    }],
    cooldown: [{
      name: { type: String },
      duration: { type: String },
      notes: { type: String }
    }],
    tips: [{ type: String }]
  },

  activity: {
    type: { type: String }, // e.g., "Yoga", "Running", "Cycling"
    duration: { type: String },
    goal: { type: String }, // e.g., "5km run", "30 mins yoga"
    calories: { type: Number }
  },

  diet: {
    meals: {
      breakfast: { item: String, calories: Number, time: String },
      snack1: { item: String, calories: Number, time: String },
      lunch: { item: String, calories: Number, time: String },
      snack2: { item: String, calories: Number, time: String },
      dinner: { item: String, calories: Number, time: String }
    },
    waterIntake: { type: String },
    totalCalories: { type: Number }
  },

  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  
  // Metadata
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure one plan per user per day
dailyPlanSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyPlan", dailyPlanSchema);
