import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Basic Physical Info
  age: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },

  // Fitness Settings
  fitnessGoal: {
    type: String,
    required: true
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  activityLevel: {
    type: String,
    enum: ['mostly sitting', 'lightly active', 'moderately active', 'very active', 'super active'],
    default: 'mostly sitting'
  },

  // Health & Preferences
  medicalConditions: [String],
  dietPreference: {
    type: String,
    enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'none'],
    default: 'none'
  },
  workoutPreference: {
    type: String,
    enum: ['home', 'gym', 'outdoor', 'mixed'],
    default: 'home'
  },
  availableEquipment: [String],
  workoutTime: String, // e.g., "morning", "evening"

  // New Field: Exercise Routine
  exerciseFrequency: {
    timesPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      default: 3
    },
    preferredDays: [String] // ["Monday", "Wednesday", "Friday"]
  },

  // AI Plan
  plan: {
    workout: [String],
    meals: [String],
    duration: {
      type: Number,
      default: 30,
      min: 1
    }
  },

  // App Permissions
  permissions: {
    emailUpdates: {
      type: Boolean,
      default: false
    },
    location: {
      type: Boolean,
      default: false
    },
    healthTracking: {
      type: Boolean,
      default: false
    }
  },

  // First Goal & points System
  firstGoal: String,
  points: {
    type: Number,
    default: 0
  },

  // Tracking Onboarding Progress
  onboardingStep: {
    type: Number,
    default: 1
  },
  isComplete: {
    type: Boolean,
    default: false
  },

  onboardingCompleted: {
  type: Boolean,
  default: false
},

  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Onboarding = mongoose.model('Onboarding', onboardingSchema);
export default Onboarding;
