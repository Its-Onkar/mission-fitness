import User from '../Schema/user.schema.js';
import Onboarding from '../Schema/onboarding.schema.js';
import Performance from '../Schema/performance.schema.js';

export const determineUserRoute = async (user, onboardingData) => {
    // First time user - needs onboarding
    if (!onboardingData || !onboardingData.isComplete) {
        return '/onboarding';
    }
    
    // Onboarding complete but user not marked as fully complete
    if (!user.onboardingCompleted) {
        return '/ai-plans';
    }
    
    // Returning user - go to main dashboard
    return '/main-dashboard';
};

export const getAdaptiveDashboardLayout = (flowState) => {
    if (flowState.isFirstTime) {
        return {
            showWelcomeModal: true,
            highlightOnboarding: true,
            showQuickStart: true,
            hideAdvancedFeatures: true
        };
    } else if (flowState.isReturning) {
        return {
            showWelcomeModal: false,
            highlightOnboarding: false,
            showQuickStart: false,
            hideAdvancedFeatures: false,
            showProgressSummary: true,
            showRecentActivity: true
        };
    } else {
        return {
            showWelcomeModal: false,
            highlightOnboarding: true,
            showQuickStart: true,
            hideAdvancedFeatures: true,
            showProgressBar: true
        };
    }
};

export const getUserFlowState = async (userId) => {
    const user = await User.findById(userId);
    const onboardingData = await Onboarding.findOne({ userId });
    
    let currentState = 'registration';
    let completionPercentage = 25; // User is registered
    let isFirstTime = true;
    let isReturning = false;
    let isComplete = false;
    
    // Check if user has completed onboarding
    if (onboardingData && onboardingData.isComplete) {
        currentState = 'onboarding_complete';
        completionPercentage = 75;
        isFirstTime = false;
        isComplete = true; // Unlock dashboard after onboarding
        isReturning = true;
    }
    
    // Check if user has AI plans generated (fitness profile exists)
    try {
        const fitnessProfile = await (await import('../Schema/fitnessprofile.schema.js')).default.findOne({ user: userId });
        if (fitnessProfile) {
            currentState = 'fully_complete';
            completionPercentage = 100;
            isFirstTime = false;
            isReturning = true;
            isComplete = true;
        }
    } catch (error) {
        console.error('Error checking fitness profile:', error);
    }
    
    // Override with user.onboardingCompleted if set
    if (user.onboardingCompleted) {
        currentState = 'fully_complete';
        completionPercentage = 100;
        isFirstTime = false;
        isReturning = true;
        isComplete = true;
    }
    
    return {
        currentState,
        completionPercentage,
        isComplete,
        hasOnboardingData: !!onboardingData,
        isFirstTime,
        isReturning
    };
};

export const markFlowStepComplete = async (userId, step) => {
    if (step === 'onboarding') {
        await Onboarding.findOneAndUpdate(
            { userId },
            { isComplete: true },
            { upsert: true }
        );
    } else if (step === 'ai_plans') {
        await User.findByIdAndUpdate(userId, { onboardingCompleted: true });
    }
};

export const getPersonalizedWelcomeMessage = (flowState, userName) => {
    if (flowState.isFirstTime) {
        return {
            title: `Welcome to Mission Fitness, ${userName}! 🎯`,
            subtitle: "Let's start your fitness journey with personalized AI plans",
            cta: "Complete your profile to get started",
            priority: "high"
        };
    } else if (flowState.isReturning) {
        return {
            title: `Welcome back, ${userName}! 💪`,
            subtitle: "Ready to continue your fitness journey?",
            cta: "Check today's workout and diet plan",
            priority: "normal"
        };
    } else {
        return {
            title: `Almost there, ${userName}! ⚡`,
            subtitle: "Complete your setup to unlock your AI fitness plans",
            cta: "Finish onboarding process",
            priority: "medium"
        };
    }
};

export const getRecommendedActions = (flowState, onboardingData) => {
    const actions = [];
    
    if (flowState.isFirstTime) {
        actions.push({
            title: "Complete Your Profile",
            description: "Tell us about your fitness goals and preferences",
            icon: "👤",
            url: "/onboarding",
            priority: 1
        });
    } else if (!flowState.isComplete) {
        actions.push({
            title: "Generate AI Plans",
            description: "Get your personalized workout and diet plans",
            icon: "🤖",
            url: "/ai-plans",
            priority: 1
        });
    } else {
        actions.push(
            {
                title: "Today's Workout",
                description: "Complete your daily fitness routine",
                icon: "💪",
                url: "#workouts",
                priority: 1
            },
            {
                title: "Track Your Diet",
                description: "Log your meals and stay on track",
                icon: "🥗",
                url: "#diet",
                priority: 2
            },
            {
                title: "View Progress",
                description: "See how far you've come",
                icon: "📈",
                url: "#progress",
                priority: 3
            }
        );
    }
    
    return actions.sort((a, b) => a.priority - b.priority);
};