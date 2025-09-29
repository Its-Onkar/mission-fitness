import mongoose, { Schema } from "mongoose";

const ExerciseRoutineSchema = new Schema(
  {
    frequencyPerWeek: { type: Number, min: 1, max: 7, default: 3 },
    preferredDays: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ExerciseRoutine = mongoose.model("ExerciseRoutine", ExerciseRoutineSchema);
export default ExerciseRoutine;
