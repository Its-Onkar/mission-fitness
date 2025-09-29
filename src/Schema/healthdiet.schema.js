import mongoose, { Schema } from "mongoose";

const HealthDietSchema = new Schema(
  {
    medicalConditions: [{ type: String, lowercase: true }],
    dietPreference: {
      type: String,
      enum: ["vegetarian", "vegan", "keto", "paleo", "gluten-free", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

const HealthDiet = mongoose.model("HealthDiet", HealthDietSchema);
export default HealthDiet;
