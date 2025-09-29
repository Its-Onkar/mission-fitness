import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fitnessProfile: { type: mongoose.Schema.Types.ObjectId, ref: "FitnessProfile" },

  goal: { type: String }, 
  meals: [
    {
      name: { type: String,enum:["Breakfast","Lunch","Dinner"] }, 
      items: [
        { food: String, calories: Number, protein: Number, carbs: Number, fats: Number }
      ]
    }
  ]
}, { timestamps: true });

export default mongoose.model("DietPlan", dietPlanSchema);
