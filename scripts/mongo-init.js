// MongoDB initialization script for Docker
db = db.getSiblingDB('mission-fitness');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('fitnessprofiles');
db.createCollection('workouts');
db.createCollection('diets');
db.createCollection('performances');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });
db.users.createIndex({ "isVerified": 1 });

db.fitnessprofiles.createIndex({ "userId": 1 }, { unique: true });
db.fitnessprofiles.createIndex({ "createdAt": 1 });

db.workouts.createIndex({ "userId": 1 });
db.workouts.createIndex({ "createdAt": 1 });
db.workouts.createIndex({ "difficulty": 1 });

db.diets.createIndex({ "userId": 1 });
db.diets.createIndex({ "createdAt": 1 });
db.diets.createIndex({ "dietaryPreference": 1 });

db.performances.createIndex({ "userId": 1 });
db.performances.createIndex({ "date": 1 });
db.performances.createIndex({ "type": 1 });

print('Database initialized successfully with indexes');