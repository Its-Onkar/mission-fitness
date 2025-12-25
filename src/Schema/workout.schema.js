import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "7-Day AI Workout Plan" },
  goal: { type: String }, // e.g. "Weight Loss"
  startDate: { type: Date, default: Date.now },
  createdByAI: { type: Boolean, default: true },



  routines: [
    {
      day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      exercises: [
        {
          name: { type: String },
          sets: { type: Number, default: 3 },
          reps: { type: mongoose.Schema.Types.Mixed, default: 12 }, // Can be Number or String for time-based exercises
          duration: { type: Number }, // in minutes
          caloriesBurn: { type: Number }
        }
      ]
    }
  ]

}, { timestamps: true });

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
