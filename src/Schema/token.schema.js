import mongoose from "mongoose";

const verifyTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    token: {
      type: String,
      required: true,
    },

    // ⏳ Auto delete after 1 hour
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 7 * 24 * 60 * 60
    },

    // 📩 Track when last verification email was sent
    lastSent: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const VerifyToken = mongoose.model("VerifyToken", verifyTokenSchema);
