import mongoose from "mongoose";

const dietLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  
  caloriesEaten: { type: Number, default: 0 },
  caloriesTarget: { type: Number, default: 2000 },
  
  waterIntake: { type: Number, default: 0 }, // in ml
  waterTarget: { type: Number, default: 2500 },
  
  meals: [{
    name: String,
    calories: Number,
    type: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"] },
    isHealthy: { type: Boolean, default: true }
  }],

  consistencyScore: { type: Number, default: 0 } // 0-100
}, { timestamps: true });

dietLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DietLog", dietLogSchema);
