import mongoose from 'mongoose';
import User from './src/Schema/user.schema.js';
import Onboarding from './src/Schema/onboarding.schema.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixUserStatus() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find user by username (replace with your username)
        const username = 'raman_k'; // Replace with your actual username
        const user = await User.findOne({ userName: username });
        
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('Current user status:', {
            userName: user.userName,
            onboardingCompleted: user.onboardingCompleted,
            isVerified: user.isVerified
        });

        // Check if onboarding data exists
        const onboardingData = await Onboarding.findOne({ userId: user._id });
        
        if (onboardingData) {
            console.log('Onboarding data exists:', {
                isComplete: onboardingData.isComplete,
                hasData: true
            });

            // Update user to mark onboarding as completed
            await User.findByIdAndUpdate(user._id, { 
                onboardingCompleted: true,
                isVerified: true 
            });

            // Update onboarding to mark as complete
            await Onboarding.findOneAndUpdate(
                { userId: user._id },
                { isComplete: true }
            );

            console.log('✅ User status updated successfully!');
            console.log('Now when you login, you should go to main-dashboard');
        } else {
            console.log('❌ No onboarding data found for this user');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixUserStatus();