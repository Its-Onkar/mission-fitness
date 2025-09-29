import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    role: { type: String, enum: ["admin", "user"], default: "user" },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
