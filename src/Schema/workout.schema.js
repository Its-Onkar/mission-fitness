import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fitnessProfile: { type: mongoose.Schema.Types.ObjectId, ref: "FitnessProfile", required: true },
  
  title: { type: String, default: "7-Day AI Workout Plan" },
  goal: { type: String }, // copied from FitnessProfile
  startDate: { type: Date, default: Date.now },
  createdByAI: { type: Boolean, default: true },

  routines: [
    {
      day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      exercises: [
        {
          name: { type: String },
          sets: { type: Number, default: 3 },
          reps: { type: Number, default: 12 },
          duration: { type: Number }, // in minutes
          caloriesBurn: { type: Number }
        }
      ]
    }
  ]
}, { timestamps: true });

export default mongoose.model("WorkoutPlan", workoutPlanSchema);
