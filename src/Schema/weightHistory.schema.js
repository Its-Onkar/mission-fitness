import mongoose from "mongoose";

const weightHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 300
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  differenceFromLast: {
    type: Number,
    default: 0
  },
  totalProgress: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

weightHistorySchema.index({ user: 1, date: -1 });

export default mongoose.model("WeightHistory", weightHistorySchema);