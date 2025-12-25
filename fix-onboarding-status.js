import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/Schema/user.schema.js';
import Onboarding from './src/Schema/onboarding.schema.js';

dotenv.config();

const fixUserOnboarding = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mission-fitness');
        console.log('Connected to database');

        // Find all users who have completed onboarding but aren't marked as complete
        const users = await User.find({});
        
        for (const user of users) {
            const onboardingData = await Onboarding.findOne({ userId: user._id });
            
            console.log(`\nUser: ${user.userName}`);
            console.log(`  Email Verified: ${user.isVerified}`);
            console.log(`  Has Onboarding Data: ${!!onboardingData}`);
            console.log(`  Onboarding Complete: ${onboardingData?.isComplete}`);
            console.log(`  User Marked Complete: ${user.onboardingCompleted}`);
            
            // If onboarding data exists and is complete, but user not marked complete
            if (onboardingData && onboardingData.isComplete && !user.onboardingCompleted) {
                console.log(`  ⚠️  FIXING: Marking user as onboarding completed`);
                await User.findByIdAndUpdate(user._id, { onboardingCompleted: true });
                console.log(`  ✅ Fixed!`);
            }
        }

        console.log('\n✅ All users checked and fixed!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixUserOnboarding();
