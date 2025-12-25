import { generateToken, verifyToken } from "../utils/auth.utils.js";
import User from "../Schema/user.schema.js";
import Onboarding from "../Schema/onboarding.schema.js";

// Helper functions for weight performance
function getWeightPerformance(current, target, start, goal) {
    if (goal === "weight loss") {
        if (current <= target) return "excellent";
        if (current > start) return "poor";
        const progress = (start - current) / (start - target);
        return progress >= 0.7 ? "good" : progress >= 0.3 ? "average" : "poor";
    }
    
    if (goal === "weight gain") {
        if (current >= target) return "excellent";
        if (current < start) return "poor";
        const progress = (current - start) / (target - start);
        return progress >= 0.7 ? "good" : progress >= 0.3 ? "average" : "poor";
    }
    
    // Maintenance goal
    const deviation = Math.abs(current - target);
    return deviation <= 1 ? "excellent" : deviation <= 3 ? "good" : "average";
}

function getWeightComment(current, target, start, goal) {
    const performance = getWeightPerformance(current, target, start, goal);
    
    if (goal === "weight loss") {
        if (performance === "excellent") return "🎉 Amazing! You've reached your weight loss goal!";
        if (performance === "good") return "💪 Great progress on your weight loss journey!";
        if (performance === "average") return "📈 Keep going! You're making steady progress.";
        return "⚠️ Poor performance - focus on diet and exercise consistency.";
    }
    
    if (goal === "weight gain") {
        if (performance === "excellent") return "🎯 Perfect! You've reached your weight gain target!";
        if (performance === "good") return "💪 Excellent progress on building mass!";
        if (performance === "average") return "📈 Good work! Keep eating and training consistently.";
        return "⚠️ Poor performance - increase calorie intake and strength training.";
    }
    
    // Maintenance
    if (performance === "excellent") return "✅ Perfect weight maintenance!";
    if (performance === "good") return "👍 Good job maintaining your weight!";
    return "⚖️ Focus on maintaining your target weight range.";
}

function calculateGoalProgress(current, start, target, goal) {
    if (goal === "weight loss") {
        if (start === target) return 100;
        return Math.max(0, Math.min(100, ((start - current) / (start - target)) * 100));
    }
    
    if (goal === "weight gain") {
        if (start === target) return 100;
        return Math.max(0, Math.min(100, ((current - start) / (target - start)) * 100));
    }
    
    // Maintenance - closer to target = higher progress
    const deviation = Math.abs(current - target);
    return Math.max(0, 100 - (deviation * 10));
}

function isMovingTowardGoal(current, previous, target, goal) {
    if (goal === "weight loss") {
        return current < previous; // Weight decreasing is good
    }
    
    if (goal === "weight gain") {
        return current > previous; // Weight increasing is good
    }
    
    // Maintenance - moving closer to target is good
    return Math.abs(current - target) <= Math.abs(previous - target);
}

export const homePageController = async (req, res) => {
    res.render("home", {
        title: "Home Page",
        layout: false
    });
}

export const resetPasswordController = async (req, res) => {
    res.render("reset-password", {
        title: "Reset Password",
        token: req.query.token,
        layout: false
    });
};

export const forgotPasswordController = async (req, res) => {
    res.render("forgot-password", {
        title: "Forgot Password",
        layout: false
    });
};

export const dashboardController = async (req, res) => {
    res.render("dashboard", {
        title: "Dashboard",
        layout: false
    });
};

export const navbarcontroller = async (req, res) => {
    res.render("navbar", {
        title: "Navbar",
        layout: false
    });
};

export const signupviewController = async (_req, res) => {
    try {
        const csrfToken = generateToken({ 
            type: 'csrf', 
            timestamp: Date.now() 
        }, '1h');
        
        res.render("sign-up", {
            title: "Signup",
            token: csrfToken,
            layout: false
        });
    } catch (error) {
        console.error("Error generating token for signup view:", error);
        res.render("sign-up", {
            title: "Signup",
            layout: false
        });
    }
};



export const onboardingviewController = async (req, res) => {
    try {
        // User is already authenticated by middleware
        const user = req.user;
        
        res.render("onboarding", {
            title: "Onboarding",
            user: {
                name: user.userName,
                email: user.email,
                id: user._id
            },
            token: req.token,
            layout: false
        });
    } catch (error) {
        console.error('Onboarding controller error:', error);
        res.redirect('/login');
    }
}

export const maindashboardController = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        
        // Check user flow state with error handling
        let flowState = {
            currentState: 'registration',
            completionPercentage: 25,
            isComplete: false,
            hasOnboardingData: false,
            isFirstTime: true,
            isReturning: false
        };
        
        try {
            const { getUserFlowState } = await import('../services/flow.service.js');
            flowState = await getUserFlowState(userId);
        } catch (flowError) {
            console.error('Error getting flow state:', flowError);
            // Continue with default flow state
        }
        
        // Fetch all necessary data in parallel
        const [onboardingData, fitnessProfile, recentPerformance] = await Promise.all([
            Onboarding.findOne({ userId }),
            (await import("../Schema/fitnessprofile.schema.js")).default.findOne({ user: userId }),
            (await import("../Schema/performance.schema.js")).default.find({ user: userId }).sort({ date: -1 }).limit(30)
        ]);

        // Get or Generate Daily Plan
        let dailyPlan = null;
        if (fitnessProfile) {
            try {
                const { getOrCreateDailyPlan } = await import("../services/aiPlans.service.js");
                dailyPlan = await getOrCreateDailyPlan(userId, fitnessProfile);
            } catch (err) {
                console.error("Failed to get daily plan:", err);
            }
        }

        // Calculate BMI
        let bmi = 22.5;
        let weight = onboardingData?.weight || fitnessProfile?.weightKg || 75;
        let height = onboardingData?.height || fitnessProfile?.heightCm || 175;
        
        if (height && weight) {
            const heightInM = height / 100;
            bmi = (weight / (heightInM * heightInM)).toFixed(1);
        }
        
        // Process Performance Data for Charts
        const progressLabels = [];
        const progressData = [];
        if (recentPerformance.length > 0) {
            recentPerformance.reverse().forEach(p => {
                progressLabels.push(new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                progressData.push(p.weight || weight);
            });
        } else {
             const today = new Date();
             progressLabels.push(today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
             progressData.push(weight);
        }

        // Calculate Stats
        const completedWorkouts = recentPerformance.filter(p => p.workoutCompleted).length;
        const completedDiets = recentPerformance.filter(p => p.dietCompleted).length;
        const totalDays = recentPerformance.length || 1;

        // Prepare Diet Data from Daily Plan
        const dietMeals = dailyPlan?.diet?.meals ? [
            { name: "Breakfast", ...dailyPlan.diet.meals.breakfast },
            { name: "Lunch", ...dailyPlan.diet.meals.lunch },
            { name: "Dinner", ...dailyPlan.diet.meals.dinner },
            { name: "Snacks", ...dailyPlan.diet.meals.snack1 }
        ] : [{ name: "No meals generated yet", calories: 0 }];

        const userData = {
            name: user.userName,
            email: user.email,
            weight: weight,
            height: height,
            bmi: bmi,
            goal: fitnessProfile?.goal || onboardingData?.goal || "General Fitness",
            caloriesBurned: dailyPlan?.workout?.caloriesTarget || 0,
            dailySteps: 0,
            heartRate: { avg: 72, resting: 60 },
            // User flow state with fallbacks
            isFirstTime: flowState?.isFirstTime || false,
            isReturning: flowState?.isReturning || false,
            completionPercentage: flowState?.completionPercentage || 25,
            flowState: flowState?.currentState || 'registration',
            isComplete: flowState?.isComplete || false,
            diet: {
                meals: dietMeals,
                todaysPlan: dailyPlan?.diet?.meals, // Pass full object for dashboard binding
                totalCalories: dailyPlan?.diet?.totalCalories || 2000,
                caloriesEaten: 0, // TODO: Fetch from today's performance/tracking
                proteinEaten: 0,
                proteinTarget: 150, // Estimate or calc
                carbsEaten: 0,
                carbsTarget: 200,
                fatsEaten: 0,
                fatsTarget: 70,
                preference: fitnessProfile?.dietPreference || "None",
                message: "Stay on track with your plan!"
            },
            dailyPlan: dailyPlan, // Pass full plan for workout section
            workouts: dailyPlan?.workout?.main ? dailyPlan.workout.main.map(e => ({
                name: e.name,
                status: "Pending",
                statusClass: "text-gray-600"
            })) : [{ name: "No workout generated yet", status: "Pending", statusClass: "text-gray-600" }],
            
            workout: {
                consistencyScore: Math.round((completedWorkouts / totalDays) * 100),
                caloriesBurned: 0,
                completedDuration: 0,
                plannedDuration: 45,
                todaysStatus: dailyPlan?.status === 'completed' ? 'completed' : 'pending',
                message: dailyPlan?.workout?.tips?.[0] || "Let's crush it today!"
            },

            sleep: { 
                lastNight: "7h", 
                quality: 85, 
                goal: 8 
            },
            hydration: { 
                today: 0, 
                goal: dailyPlan?.diet?.waterIntake || "2500ml"
            },
            progress: {
                labels: progressLabels,
                data: progressData
            },
            stats: {
                currentStreak: recentPerformance.length > 0 ? recentPerformance[0].streak : 0,
                workoutCompletionRate: Math.round((completedWorkouts / totalDays) * 100),
                dietCompletionRate: Math.round((completedDiets / totalDays) * 100),
                totalScore: fitnessProfile?.points || 0
            },
            summary: {
                readinessScore: 85,
                message: "You are ready to train!",
                status: { sleep: "Good", water: "Low", steps: "Avg" }
            }
        };
        
        res.render("maindashboard", {
            title: "Main Dashboard",
            user: userData,
            userJSON: JSON.stringify(userData),
            token: req.token,
            layout: false,
            isFirstTime: userData.isFirstTime || false,
            isReturning: userData.isReturning || false,
            flowState: userData.flowState || 'registration',
            completionPercentage: userData.completionPercentage || 25
        });
    } catch (error) {
        console.error("Error in main dashboard:", error);
        const msg = (error && error.message) ? error.message : String(error);
        const stack = (error && error.stack) ? error.stack : "No stack trace available";
        try {
            res.status(500).send(`<h1>Main Dashboard Error</h1><p>${msg}</p><pre>${stack}</pre>`);
        } catch (sendError) {
            console.error("Failed to send error response:", sendError);
        }
    }
}


export const loginviewController = async (req, res) => {
    try {
        const token = generateToken(
            { type: "csrf", timestamp: Date.now() },
            "1h"
        );

        res.render("signin", {
            title: "Login",
            token: token,
            layout: false
        });
    } catch (error) {
        console.error("Error generating token for login view:", error);
        res.render("signin", {
            title: "Login",
            layout: false
        });
    }
};

export const planResponseController = async (req, res) => {
    const { response } = req.query;
    res.render("plan-response", {
        title: "Plan Update Response",
        response: response || "Your plan has been updated successfully!"
    });
};

export const verifyemailcontroller = async (req, res) => {
    const { token } = req.query;
    
    if (token) {
        // If token is present, show verification result page
        res.render("verify-email", {
            title: "Email Verification",
            token: token
        });
    } else {
        // If no token, show instruction page
        res.render("verify-email", {
            title: "Verify Email",
            message: "Please check your email and click the verification link to activate your account."
        });
    }
};

export const verifiedemailcontroller = async (req, res) => {
    const { token } = req.query;
    
    if (token) {
        try {
            // Verify the email using the token
            const { verifyEmailService } = await import('../services/auth.service.js');
            const result = await verifyEmailService(token);
            
            res.render("verified-email", {
                title: "Email Verification",
                success: true,
                message: result.message,
                layout: false
            });
        } catch (error) {
            console.error('Email verification error:', error);
            res.render("verified-email", {
                title: "Email Verification",
                success: false,
                message: error.message || "Verification failed",
                layout: false
            });
        }
    } else {
        // No token provided
        res.render("verified-email", {
            title: "Email Verification",
            success: false,
            message: "Invalid verification link",
            layout: false
        });
    }
};

export const dailyActivityViewController = async (req, res) => {
    try {
        const user = req.user;
        
        res.render("daily-activity", {
            title: "Daily Activity",
            user: {
                name: user.userName,
                email: user.email,
                id: user._id
            },
            token: req.token,
            layout: false
        });
    } catch (error) {
        console.error('Daily activity view error:', error);
        res.redirect('/main-dashboard');
    }
};

export const dashboardDataController = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        
        const onboardingData = await Onboarding.findOne({ userId });
        const fitnessProfile = await (await import("../Schema/fitnessprofile.schema.js")).default.findOne({ user: userId });
        const recentPerformance = await (await import("../Schema/performance.schema.js")).default.find({ user: userId }).sort({ date: -1 }).limit(30);
        
        let dailyPlan = null;
        if (fitnessProfile) {
            try {
                const { getOrCreateDailyPlan } = await import("../services/aiPlans.service.js");
                dailyPlan = await getOrCreateDailyPlan(userId, fitnessProfile);
            } catch (err) {
                console.error("Failed to get daily plan:", err);
            }
        }
        
        // Get weight data from weight history and fitness profile
        const WeightHistory = await (await import("../Schema/weightHistory.schema.js")).default;
        const weightHistory = await WeightHistory.find({ user: userId }).sort({ date: -1 }).limit(2);
        
        const currentWeight = weightHistory[0]?.weight || fitnessProfile?.weightKg || onboardingData?.weight || 75;
        const previousWeight = weightHistory[1]?.weight || currentWeight;
        const startWeight = fitnessProfile?.startWeight || fitnessProfile?.weightKg || onboardingData?.weight || currentWeight;
        
        // Set target weight based on goal
        let targetWeight;
        if (fitnessProfile?.targetWeight) {
            targetWeight = fitnessProfile.targetWeight;
        } else if (onboardingData?.targetWeight) {
            targetWeight = onboardingData.targetWeight;
        } else {
            // Calculate target based on goal if not set
            const goal = fitnessProfile?.goal || onboardingData?.goal || 'maintenance';
            if (goal === 'weight loss') {
                targetWeight = startWeight - 10; // Default 10kg loss
            } else if (goal === 'weight gain') {
                targetWeight = startWeight + 10; // Default 10kg gain
            } else {
                targetWeight = startWeight; // Maintenance
            }
        }
        
        const completedWorkouts = recentPerformance.filter(p => p.workoutCompleted).length;
        const completedDiets = recentPerformance.filter(p => p.dietCompleted).length;
        const totalDays = recentPerformance.length || 1;
        
        const dashboardData = {
            user: {
                name: user.userName,
                email: user.email,
                avatar: user.avatar || null,
                needsOnboarding: !onboardingData,
                goal: onboardingData?.goal || fitnessProfile?.goal || "General Fitness",
                currentWeight,
                targetWeight,
                startWeight,
                notificationTime: onboardingData?.notificationTime || "09:00"
            },
            summary: {
                readinessScore: 85,
                message: "You're ready to train!",
                status: {
                    sleep: "Good (7h)",
                    water: "2/8 glasses",
                    steps: "3,200 steps"
                }
            },
            weight: {
                current: currentWeight,
                previous: previousWeight,
                target: targetWeight,
                startWeight: startWeight,
                diff: (currentWeight - previousWeight).toFixed(1),
                trend: currentWeight > previousWeight ? "gained" : currentWeight < previousWeight ? "lost" : "stable",
                totalProgress: (startWeight - currentWeight).toFixed(1),
                goal: fitnessProfile?.goal || "maintenance",
                performance: getWeightPerformance(currentWeight, targetWeight, startWeight, fitnessProfile?.goal),
                comment: getWeightComment(currentWeight, targetWeight, startWeight, fitnessProfile?.goal),
                // Enhanced tracking data
                dailyChange: (currentWeight - previousWeight).toFixed(1),
                weeklyTrend: ((currentWeight - previousWeight) * 7).toFixed(1),
                remainingToTarget: fitnessProfile?.goal === 'weight loss' ? 
                    Math.max(0, currentWeight - targetWeight).toFixed(1) : 
                    fitnessProfile?.goal === 'weight gain' ? 
                    Math.max(0, targetWeight - currentWeight).toFixed(1) : 
                    Math.abs(currentWeight - targetWeight).toFixed(1),
                goalProgress: calculateGoalProgress(currentWeight, startWeight, targetWeight, fitnessProfile?.goal),
                isMovingTowardGoal: isMovingTowardGoal(currentWeight, previousWeight, targetWeight, fitnessProfile?.goal),
                workoutConsistency: Math.round((completedWorkouts / totalDays) * 100),
                dietConsistency: Math.round((completedDiets / totalDays) * 100)
            },
            diet: {
                consistencyScore: Math.round((completedDiets / totalDays) * 100),
                caloriesEaten: 1200,
                caloriesTarget: 1800,
                proteinEaten: 60,
                proteinTarget: 120,
                carbsEaten: 150,
                carbsTarget: 200,
                fatsEaten: 40,
                fatsTarget: 70,
                todaysPlan: dailyPlan?.diet?.meals || {
                    breakfast: { item: "Oats with banana", calories: 320 },
                    lunch: { item: "Paneer tikka with quinoa", calories: 450 },
                    dinner: { item: "Dal with brown rice", calories: 380 },
                    snack1: { item: "Greek yogurt", calories: 180 }
                },
                message: "Stay on track!"
            },
            workout: {
                consistencyScore: Math.round((completedWorkouts / totalDays) * 100),
                caloriesBurned: 0,
                completedDuration: 0,
                plannedDuration: 45,
                todaysStatus: "pending",
                weeklyStats: {
                    completed: completedWorkouts,
                    planned: 7
                },
                weeklyProgress: [true, false, true, false, false, false, false],
                message: "Let's crush today's workout!"
            },
            dailyPlan: dailyPlan || {
                workout: {
                    intensity: "Medium",
                    warmup: [{ name: "Jumping Jacks", duration: "2 min" }],
                    main: [{ name: "Push-ups", sets: 3, reps: "8-12" }],
                    cooldown: [{ name: "Stretching", duration: "5 min" }],
                    tips: ["Stay hydrated!"]
                },
                activity: {
                    type: "Walking",
                    duration: "30 mins",
                    calories: "150 kcal"
                }
            },
            weekly: {
                totalCalories: 1500,
                totalWorkouts: completedWorkouts,
                totalSteps: "25,000"
            },
            streaks: {
                workout: recentPerformance.length > 0 ? recentPerformance[0].streak || 0 : 0,
                water: 3,
                badges: ["Beginner", "Consistent"]
            },
            calendar: {
                today: ["Workout at 6:00 PM", "Meal prep"]
            }
        };
        
        res.json(dashboardData);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
};




