export const chatController = async (req, res) => {
    res.status(200).json({ message: 'Chat endpoint working' });
};

export const fitnessExpertChat = async (req, res) => {
    try {
        const { message, userContext } = req.body;
        const user = req.user;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        // Get user fitness profile for context
        const FitnessProfile = await (await import('../Schema/fitnessprofile.schema.js')).default;
        const fitnessProfile = await FitnessProfile.findOne({ user: user._id });
        
        // Enhanced user context
        const enhancedContext = {
            userName: user.userName,
            goal: fitnessProfile?.goal || userContext?.goal || 'General Fitness',
            currentWeight: userContext?.currentWeight || fitnessProfile?.weightKg || 'Not set',
            targetWeight: fitnessProfile?.targetWeight || 'Not set',
            workoutStreak: userContext?.workoutStreak || 0,
            dietPreference: fitnessProfile?.dietPreference || 'Vegetarian',
            fitnessLevel: fitnessProfile?.fitnessLevel || 'Beginner',
            age: fitnessProfile?.age || 25,
            height: fitnessProfile?.heightCm || 170
        };
        
        // Use AI chat service
        const { chatService } = await import('../services/chat.service.js');
        const response = await chatService(enhancedContext, message);
        
        res.status(200).json({
            success: true,
            response,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Fitness chat error:', error);
        
        // Fallback to local response if AI fails
        const fallbackResponse = generateFitnessResponse(message, userContext);
        
        res.status(200).json({
            success: true,
            response: fallbackResponse,
            timestamp: new Date().toISOString(),
            fallback: true
        });
    }
};

function generateFitnessResponse(message, userContext) {
    const msg = message.toLowerCase();
    const { name, goal, currentWeight, workoutStreak } = userContext || {};
    
    // Progress tracking
    if (msg.includes('progress') || msg.includes('how am i') || msg.includes('my progress') || msg.includes('show')) {
        return `📊 Your Current Progress:\n\n💪 Workout Streak: ${workoutStreak || 0} days\n⚖️ Current Weight: ${currentWeight || 'Not set'}kg\n🎯 Goal: ${goal || 'General Fitness'}\n\n${parseInt(workoutStreak || 0) > 3 ? 'Amazing consistency! You\'re building great habits! 🔥' : 'Focus on building daily habits. Every workout counts!'}`;
    }
    
    // Vegetarian weight loss specific
    if (msg.includes('vegetarian') && (msg.includes('weight') || msg.includes('decreasing') || msg.includes('loss'))) {
        return `🌱 Vegetarian Weight Loss Plan:\n\n🥗 HIGH PROTEIN FOODS:\n• Paneer: 18g per 100g\n• Greek yogurt: 17g per 100g\n• Lentils: 18g per cup\n• Chickpeas: 15g per cup\n• Quinoa: 8g per cup\n\n🔥 FAT BURNING FOODS:\n• Green tea: Boosts metabolism\n• Spinach: Low cal, high nutrients\n• Oats: Keeps you full\n• Almonds: Healthy fats\n\n📋 SAMPLE DAY:\n• Breakfast: Oats + berries (300 cal)\n• Lunch: Lentil curry + quinoa (450 cal)\n• Snack: Greek yogurt (150 cal)\n• Dinner: Paneer + vegetables (400 cal)\n\nTarget: 1500-1700 calories for weight loss!`;
    }
    
    // Workout questions
    if (msg.includes('workout') || msg.includes('exercise')) {
        return `💪 Workout Guidance for ${goal || 'fitness'}:\n\n🏃 CARDIO: 150 min/week\n• Brisk walking, cycling, swimming\n• Start with 20-30 min sessions\n\n🏋️ STRENGTH: 3x/week\n• Push-ups, squats, planks\n• Progressive overload\n\n📅 WEEKLY PLAN:\n• Mon/Wed/Fri: Strength\n• Tue/Thu/Sat: Cardio\n• Sunday: Rest or light activity\n\nYour current streak: ${workoutStreak || 0} days!`;
    }
    
    // Diet/nutrition questions
    if (msg.includes('diet') || msg.includes('nutrition') || msg.includes('eat')) {
        return `🍽️ Nutrition for ${goal || 'fitness'}:\n\n🥗 MACROS BREAKDOWN:\n• Protein: 1.6g per kg body weight\n• Carbs: 45-65% of calories\n• Fats: 20-35% of calories\n\n🕐 MEAL TIMING:\n• Eat every 3-4 hours\n• Protein with each meal\n• Pre-workout: Carbs + protein\n• Post-workout: Protein within 30 min\n\n💧 HYDRATION:\n• 8-10 glasses water daily\n• Extra 500ml during workouts\n\nWhat's your specific dietary preference?`;
    }
    
    // Motivation
    if (msg.includes('motivat') || msg.includes('encourage')) {
        return `🔥 You've Got This!\n\n"Success is the sum of small efforts repeated day in and day out."\n\n🎯 Your Goal: ${goal || 'Getting fit'}\n💪 Current Streak: ${workoutStreak || 0} days\n\n✨ REMEMBER:\n• Progress over perfection\n• Every workout counts\n• Consistency beats intensity\n• Your future self will thank you\n\nKeep pushing forward! 💪`;
    }
    
    // Greeting
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return `👋 Hi ${name || 'there'}! I'm your AI fitness expert.\n\nI can help you with:\n\n💪 Workout plans\n🥗 Nutrition advice\n📊 Progress tracking\n🎯 Goal achievement\n🔥 Motivation\n\nWhat would you like to know about your fitness journey?`;
    }
    
    // Default response
    return `I can help you with specific fitness questions! Try asking:\n\n• "Show my progress"\n• "Vegetarian foods for weight loss"\n• "Create a workout plan"\n• "What should I eat today?"\n• "I need motivation"\n\nWhat specific area interests you?`;
}