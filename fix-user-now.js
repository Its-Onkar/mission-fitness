import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/Schema/user.schema.js';

dotenv.config();

const fixUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mission-fitness');
        console.log('Connected to database\n');
        
        // Update the user ramanpreetkaur to mark onboarding as complete
        const result = await User.updateOne(
            { userName: 'ramanpreetkaur' },
            { $set: { onboardingCompleted: true } }
        );
        
        console.log(`Updated ${result.modifiedCount} user(s)`);
        
        // Verify the update
        const user = await User.findOne({ userName: 'ramanpreetkaur' });
        console.log(`\n✅ User ${user.userName} status:`);
        console.log(`   onboardingCompleted: ${user.onboardingCompleted}`);
        
        await mongoose.disconnect();
        console.log('\n✅ Done! User should now go to main dashboard on login.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixUser();
