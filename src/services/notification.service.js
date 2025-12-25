import nodemailer from 'nodemailer';
import cron from 'node-cron';
import User from '../Schema/user.schema.js';
import Onboarding from '../Schema/onboarding.schema.js';

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate daily workout based on user preferences
const generateDailyWorkout = (goal, fitnessLevel) => {
    const workouts = {
        'Weight Loss': [
            'HIIT Circuit: 20 min cardio + 15 min strength',
            'Fat Burn: 30 min brisk walk + bodyweight exercises',
            'Cardio Blast: 25 min cycling + core workout'
        ],
        'Muscle Gain': [
            'Upper Body: Push-ups, pull-ups, shoulder press',
            'Lower Body: Squats, lunges, calf raises',
            'Full Body: Compound movements + isolation'
        ],
        'General Fitness': [
            'Balanced Mix: 20 min cardio + 20 min strength',
            'Flexibility Focus: Yoga + light cardio',
            'Endurance: 30 min moderate intensity workout'
        ]
    };
    
    const goalWorkouts = workouts[goal] || workouts['General Fitness'];
    return goalWorkouts[Math.floor(Math.random() * goalWorkouts.length)];
};

// Generate daily diet based on preferences
const generateDailyDiet = (dietPreference, goal) => {
    const diets = {
        vegetarian: {
            breakfast: 'Oats with banana and almonds (320 cal)',
            lunch: 'Paneer tikka with quinoa (450 cal)',
            dinner: 'Dal with brown rice (380 cal)',
            snack: 'Greek yogurt with berries (180 cal)'
        },
        vegan: {
            breakfast: 'Chia pudding with almond milk (280 cal)',
            lunch: 'Quinoa Buddha bowl (480 cal)',
            dinner: 'Lentil curry with rice (420 cal)',
            snack: 'Mixed nuts and dates (200 cal)'
        },
        'non-vegetarian': {
            breakfast: 'Egg sandwich (350 cal)',
            lunch: 'Grilled chicken with quinoa (480 cal)',
            dinner: 'Fish curry with rice (420 cal)',
            snack: 'Protein shake (220 cal)'
        }
    };
    
    return diets[dietPreference] || diets['vegetarian'];
};

// Send daily notification email
export const sendDailyNotification = async (user, onboardingData) => {
    try {
        const workout = generateDailyWorkout(onboardingData.goal, onboardingData.fitnessLevel);
        const diet = generateDailyDiet(onboardingData.dietPreference, onboardingData.goal);
        
        const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b35, #f59e0b); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ Daily Mission Fitness</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your personalized plan for today</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 15px;">💪 Today's Workout</h2>
                <p style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 0; color: #92400e; font-weight: 500;">${workout}</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 15px;">🥗 Today's Meal Plan</h2>
                <div style="display: grid; gap: 10px;">
                    <div style="background: #fef3c7; padding: 10px; border-radius: 8px;">
                        <strong>🌅 Breakfast:</strong> ${diet.breakfast}
                    </div>
                    <div style="background: #dbeafe; padding: 10px; border-radius: 8px;">
                        <strong>🍽️ Lunch:</strong> ${diet.lunch}
                    </div>
                    <div style="background: #f3e8ff; padding: 10px; border-radius: 8px;">
                        <strong>🌙 Dinner:</strong> ${diet.dinner}
                    </div>
                    <div style="background: #dcfce7; padding: 10px; border-radius: 8px;">
                        <strong>🥜 Snack:</strong> ${diet.snack}
                    </div>
                </div>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 15px;">🎯 Your Goal: ${onboardingData.goal}</h2>
                <p style="color: #6b7280; margin: 0;">Stay consistent and track your progress in the app!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.APP_URL || 'http://localhost:5000'}/main-dashboard" 
                   style="background: linear-gradient(135deg, #ff6b35, #f59e0b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                    Open Mission Fitness App
                </a>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>Mission Fitness - Your AI-powered fitness companion</p>
                <p>You're receiving this because you selected daily notifications at ${onboardingData.notificationTime}</p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `🏋️ Your Daily Mission Fitness Plan - ${new Date().toLocaleDateString()}`,
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Daily notification sent to ${user.email}`);
        
    } catch (error) {
        console.error('Error sending daily notification:', error);
    }
};

// Schedule daily notifications
export const scheduleDailyNotifications = () => {
    // Run every hour to check for users who need notifications
    cron.schedule('0 * * * *', async () => {
        try {
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            
            // Find users who have notifications scheduled for this time
            const users = await User.find({ isVerified: true });
            
            for (const user of users) {
                const onboardingData = await Onboarding.findOne({ userId: user._id });
                
                if (onboardingData && onboardingData.notificationTime) {
                    const [notifHour, notifMinute] = onboardingData.notificationTime.split(':');
                    const notifTime = `${notifHour.padStart(2, '0')}:${notifMinute.padStart(2, '0')}`;
                    
                    // Send notification if time matches (within the hour)
                    if (notifTime === currentTime) {
                        await sendDailyNotification(user, onboardingData);
                    }
                }
            }
        } catch (error) {
            console.error('Error in scheduled notifications:', error);
        }
    });
    
    console.log('Daily notification scheduler started');
};

// Send welcome notification
export const sendWelcomeNotification = async (user, onboardingData) => {
    try {
        const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b35, #f59e0b); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Mission Fitness!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your fitness journey starts now</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${user.userName}! 👋</h2>
                <p style="color: #6b7280; line-height: 1.6;">
                    Congratulations on taking the first step towards your fitness goal: <strong>${onboardingData.goal}</strong>!
                </p>
                <p style="color: #6b7280; line-height: 1.6;">
                    We've set up your personalized AI-powered fitness plan based on your preferences. 
                    You'll receive daily workout and nutrition plans at <strong>${onboardingData.notificationTime}</strong> every day.
                </p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-bottom: 15px;">🚀 What's Next?</h2>
                <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
                    <li>Check your dashboard for today's personalized plan</li>
                    <li>Track your workouts and meals</li>
                    <li>Monitor your progress towards your goal</li>
                    <li>Chat with our AI fitness expert anytime</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.APP_URL || 'http://localhost:5000'}/main-dashboard" 
                   style="background: linear-gradient(135deg, #ff6b35, #f59e0b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                    Start Your Fitness Journey
                </a>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>Mission Fitness - Your AI-powered fitness companion</p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '🎉 Welcome to Mission Fitness - Your Journey Begins!',
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome notification sent to ${user.email}`);
        
    } catch (error) {
        console.error('Error sending welcome notification:', error);
    }
};