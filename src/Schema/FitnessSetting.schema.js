import mongoose, { Schema } from "mongoose";

const FitnessSettingsSchema = new Schema(
  {
    goal: {
      type: String,
      enum: ["weight loss", "muscle gain", "maintenance", "balanced", "weight gain"],
      required: true,
    },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    activityLevel: {
      type: String,
      enum: ["mostly sitting", "lightly active", "moderately active", "very active", "super active"],
      default: "mostly sitting",
    },
    workoutPreference: { type: String, enum: ["home", "gym", "outdoor", "mixed"], default: "home" },
    availableEquipment: [{ type: String, lowercase: true }],
    preferredWorkoutTime: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
      default: "morning",
    },
  },
  { timestamps: true }
);

const FitnessSettings = mongoose.model("FitnessSettings", FitnessSettingsSchema);
export default FitnessSettings;
