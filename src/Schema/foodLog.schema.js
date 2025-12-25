import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fats: {
    type: Number,
    default: 0
  },
  isHealthy: {
    type: Boolean,
    default: true
  },
  loggedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

foodLogSchema.index({ user: 1, date: 1 });

export default mongoose.model("FoodLog", foodLogSchema);
