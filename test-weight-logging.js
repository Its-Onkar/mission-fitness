import mongoose from 'mongoose';
import { MONGO_URI } from './src/config/variables.js';
import { addWeight } from './src/services/weight.service.js';
import User from './src/Schema/user.schema.js';

async function testWeightLogging() {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a test user
    const testUser = await User.findOne().limit(1);
    if (!testUser) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`📝 Testing with user: ${testUser.name} (${testUser._id})`);

    // Test weight logging
    const testWeight = 70.5;
    const testNotes = 'Test weight entry';

    console.log(`🔄 Logging weight: ${testWeight} kg`);
    
    const result = await addWeight(testUser._id, testWeight, testNotes);
    
    console.log('✅ Weight logged successfully!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

testWeightLogging();