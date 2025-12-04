import mongoose from "mongoose";

const fitnessProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Personal Info
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  age: { type: Number, required: true },
  heightCm: { type: Number, required: true },
  weightKg: { type: Number, required: true },
  startWeight: { type: Number }, // To track total weight loss
  targetWeight: { type: Number }, // Target weight goal
  
  // Fitness Goals & Preferences
  goal: { type: String, enum: ["weight loss","muscle gain","maintenance","balanced","weight gain"], required: true },
  fitnessLevel: { type: String, enum: ["beginner","intermediate","advanced"], default: "beginner" },
  activityLevel: { type: String, enum: ["mostly sitting","lightly active","moderately active","very active","super active"], default: "mostly sitting" },
  workoutPreference: { type: String, enum: ["home","gym","outdoor","mixed"], default: "home" },
  availableEquipment: [{ type: String }],
  preferredWorkoutTime: { type: String, enum: ["morning","afternoon","evening","night"], default: "morning" },

  // Health & Diet
  medicalConditions: [{ type: String }],
  dietPreference: { type: String, enum: ["vegetarian","vegan","keto","paleo","gluten-free","none"], default: "none" },

  // Exercise Frequency
  exerciseFrequency: {
    timesPerWeek: { type: Number, min: 1, max: 7, default: 3 },
    preferredDays: [{ type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] }]
  },

  // AI Plan Reference
  workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan" },
  dietPlan: { type: mongoose.Schema.Types.ObjectId, ref: "DietPlan" },

  // App Permissions
  permissions: {
    emailUpdates: { type: Boolean, default: false },
    locationAccess: { type: Boolean, default: false },
    healthTracking: { type: Boolean, default: false },
  },

  // Points & Tracking
  badges: [{
    name: String,
    icon: String, // e.g., "trophy", "flame", "droplet"
    dateEarned: { type: Date, default: Date.now },
    description: String
  }],
  points: { type: Number, default: 0 },
  onboardingStep: { type: Number, default: 1 },
  isComplete: { type: Boolean, default: false },

  // Created / Updated By
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("FitnessProfile", fitnessProfileSchema);
