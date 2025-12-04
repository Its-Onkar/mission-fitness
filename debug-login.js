import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/Schema/user.schema.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mission-fitness');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function debugLogin() {
  try {
    await connectDB();
    
    // Check total users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
    if (totalUsers === 0) {
      console.log('⚠️  No users found in database');
      
      // Create a test user
      const hashedPassword = bcrypt.hashSync('password123', 10);
      
      const testUser = new User({
        userName: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: true,
        status: 'active'
      });

      await testUser.save();
      console.log('✅ Test user created:');
      console.log('   Username: testuser');
      console.log('   Password: password123');
      console.log('   Email: test@example.com');
    } else {
      // List existing users
      const users = await User.find({}, 'userName email isVerified status').limit(5);
      console.log('👥 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.userName} (${user.email}) - Verified: ${user.isVerified}, Status: ${user.status}`);
      });
    }
    
    // Test password comparison
    const testUser = await User.findOne({ userName: { $regex: /testuser/i } });
    if (testUser) {
      console.log('\n🔐 Testing password comparison:');
      const isValid = bcrypt.compareSync('password123', testUser.password);
      console.log(`   Password 'password123' is valid: ${isValid}`);
      
      const isInvalid = bcrypt.compareSync('wrongpassword', testUser.password);
      console.log(`   Password 'wrongpassword' is valid: ${isInvalid}`);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

debugLogin();