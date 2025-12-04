import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/Schema/user.schema.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mission-fitness');

async function createTestUser() {
    try {
        // Check if test user already exists
        const existingUser = await User.findOne({ userName: 'testuser' });
        if (existingUser) {
            console.log('Test user already exists');
            return;
        }

        // Create test user
        const hashedPassword = bcrypt.hashSync('password123', 10);
        
        const testUser = new User({
            userName: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            isVerified: true,
            status: 'active'
        });

        await testUser.save();
        console.log('Test user created successfully!');
        console.log('Username: testuser');
        console.log('Password: password123');
        
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.connection.close();
    }
}

createTestUser();