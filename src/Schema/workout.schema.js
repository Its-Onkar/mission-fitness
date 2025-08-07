import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "7-Day AI Workout Plan" },
  goal: { type: String }, // e.g. "Weight Loss"
  startDate: { type: Date, default: Date.now },
  createdByAI: { type: Boolean, default: true },
}, { timestamps: true });

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
