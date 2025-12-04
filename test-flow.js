// Simple test to verify the user flow
import User from "./src/Schema/user.schema.js";
import { createPasswordHash } from "./src/utils/auth.utils.js";

const testUser = {
  userName: "testuser",
  email: "test@example.com", 
  password: createPasswordHash("password123"),
  onboardingCompleted: false
};

console.log("Test user data:", testUser);
console.log("Flow: signup → login → onboarding → main dashboard");