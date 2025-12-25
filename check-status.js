import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/Schema/user.schema.js';
import Onboarding from './src/Schema/onboarding.schema.js';

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mission-fitness');
        
        const users = await User.find({});
        
        for (const user of users) {
            const onboarding = await Onboarding.findOne({ userId: user._id });
            
            console.log(`\n========================================`);
            console.log(`User: ${user.userName}`);
            console.log(`Email: ${user.email}`);
            console.log(`isVerified: ${user.isVerified}`);
            console.log(`onboardingCompleted: ${user.onboardingCompleted}`);
            console.log(`Has Onboarding Data: ${!!onboarding}`);
            console.log(`Onboarding isComplete: ${onboarding?.isComplete}`);
            console.log(`========================================`);
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkStatus();
