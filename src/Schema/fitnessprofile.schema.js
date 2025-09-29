import mongoose, { Schema } from "mongoose";

const FitnessProfileSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    gender: { type:  Schema.Types.String, enum: ["male", "female", "other"], required: true },
    age: { type:  Schema.Types.Number, required: true },
    heightCm: { type:  Schema.Types.Number, required: true },
    weightKg: { type:  Schema.Types.Number, required: true },

    fitnessSettings: { type: mongoose.Schema.Types.ObjectId, ref: "FitnessSettings" },
    exerciseRoutine: { type: mongoose.Schema.Types.ObjectId, ref: "ExerciseRoutine" },
    healthDiet: { type: mongoose.Schema.Types.ObjectId, ref: "HealthDiet" },
    permissions: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
    aiPlan: { type: mongoose.Schema.Types.ObjectId, ref: "AIPlan" },

    firstGoal: { type: Schema.Types.String, required: true }, 
    points: { type:  Schema.Types.Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const FitnessProfile = mongoose.model("FitnessProfile", FitnessProfileSchema);
export default FitnessProfile;
