import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
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
  workoutCompleted: {
    type: Boolean,
    default: false
  },
  dietCompleted: {
    type: Boolean,
    default: false
  },
  workoutCompletedAt: {
    type: Date
  },
  dietCompletedAt: {
    type: Date
  },
  streak: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: null
  },
  weightNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

performanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Performance", performanceSchema);