import mongoose, { Schema } from "mongoose";

const AIPlanSchema = new Schema(
  {
    workoutPlan: [{ type: String }],
    mealPlan: [{ type: String }],
    durationMinutes: { type: Number, default: 30, min: 1 },
  },
  { timestamps: true }
);

const AIPlan = mongoose.model("AIPlan", AIPlanSchema);
export default AIPlan;
