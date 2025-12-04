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

<<<<<<< Updated upstream
export const signupviewController = async (req, res) => {
    res.render("sign-up", {
        title: "Signup",
    });
};

export const loginviewController = async (req, res) => {
    res.render("signin", {
        title: "Login",
    });
};
=======
import { generateToken, verifyToken } from "../utils/auth.utils.js";

import User from "../Schema/user.schema.js";
import Onboarding from "../Schema/onboarding.schema.js";

export const signupviewController = async (_req, res) => {
    try {
        // Generate a simple CSRF token for form protection
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
            layout: false
        });
    } catch (error) {
        console.error("Error in main dashboard:", error);
        res.render("maindashboard", {
            title: "Main Dashboard",
            user: { name: "User", email: "user@example.com" },
            userJSON: JSON.stringify({ name: "User", email: "user@example.com" }),
            layout: false
        });
    }
}


export const loginviewController = async (req, res) => {
    try {
        const token = generateToken(
            { type: "csrf", timestamp: Date.now() },
            "1h"
        );

        res.render("login", {
            title: "Login",
            token: token,
            layout: false
        });
    } catch (error) {
        console.error("Error generating token for login view:", error);
        res.render("login", {
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
        res.render("verified-email", {
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
    const { success } = req.query;
    res.render("verified-email", {
        title: "Email Verification",
        success: success === 'true'
    });
    // Render the verified email page with success message
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



>>>>>>> Stashed changes
