import mongoose from "mongoose";

const dietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    dietPlan: {
      type: String,
      enum: ["weight loss", "muscle gain", "maintenance", "balanced","weight gain"],
      default: "balanced",
    },

    dietDuration: {
      type: Number,
      required: true,
    },

    mealDetails: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "in-progress", "incomplete"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Diet = mongoose.model("Diet", dietSchema);
export default Diet;
