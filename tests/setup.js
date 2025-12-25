import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  await mongoServer.stop();
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test utilities
global.testUtils = {
  // Create test user data
  createTestUser: () => ({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    isVerified: true
  }),
  
  // Create test fitness profile
  createTestProfile: () => ({
    age: 25,
    gender: 'male',
    height: 175,
    weight: 70,
    activityLevel: 'moderate',
    fitnessGoal: 'muscle_gain',
    dietaryPreference: 'none',
    workoutPreference: 'gym'
  }),
  
  // Generate JWT token for testing
  generateTestToken: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
  }
};