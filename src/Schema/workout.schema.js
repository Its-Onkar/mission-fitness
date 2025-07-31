import e from "express";
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  musclesTargeted: [String],
  equipment: { type: String },
  duration: { type: Number },
  estimatedCalories: { type: Number },
  createdByAI: { type: Boolean, default: true },


  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "skipped", "too-hard", "too-easy"],
    default: "not-started"
  },

 
  userFeedback: {
    type: String,
    enum: ["too-easy", "just-right", "too-hard"],
  },

  performedAt: { type: Date } 

}, { timestamps: true });



const Exercise= mongoose.model("Exercise", exerciseSchema);
export default Exercise;
