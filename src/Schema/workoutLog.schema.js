import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  
  duration: { type: Number, default: 0 }, // minutes
  targetDuration: { type: Number, default: 45 },
  
  caloriesBurned: { type: Number, default: 0 },
  
  poseAccuracy: { type: Number, default: 0 }, // Average accuracy %
  
  completedExercises: [{
    name: String,
    sets: Number,
    reps: Number,
    accuracy: Number
  }],

  consistencyScore: { type: Number, default: 0 } // 0-100
}, { timestamps: true });

workoutLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("WorkoutLog", workoutLogSchema);
