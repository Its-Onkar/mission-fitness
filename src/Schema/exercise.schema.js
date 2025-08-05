const exerciseSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  musclesTargeted: [String],
  equipment: { type: String },
  duration: { type: Number },
  estimatedCalories: { type: Number },

  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "skipped", "too-hard", "too-easy"],
    default: "not-started"
  },
  userFeedback: {
    type: String,
    enum: ["too-easy", "just-right", "too-hard"],
  },
  performedAt: { type: Date },

  day: { type: String }, // Optional: "Monday", "Day 1", etc.
  createdByAI: { type: Boolean, default: true },

}, { timestamps: true });

const Exercise = mongoose.model("Exercise", exerciseSchema);
