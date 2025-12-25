import { JWT_SECRET } from "../config/variables.js";
import User from "../Schema/user.schema.js";
import logger from "../utils/logger.js";

import { forgotPassword, login, resetPassword, signup, verifyEmailService, resendVerification } from "../services/auth.service.js";


export const signupController = async (req, res) => {
  try {
    const userData = req.body;
    const user = await signup(userData);

    res.status(200).json({
      message: "User created successfully. Please check your email to verify your account.",
      user,
      requiresVerification: true
    });
  } catch (error) {
    console.error("Signup error:", error); 
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || JSON.stringify(error),
    });
  }
};

export const loginController = async (req, res) => {
    try {
        const userData = req.body;
        console.log("Login attempt for:", userData.userName);
        
        // Validate input
        if (!userData.userName || !userData.password) {
            return res.status(400).json({ 
                error: "Username and password are required" 
            });
        }
        
        const result = await login(userData);
        console.log("Login successful for user:", result.user.userName);
        
        // Skip email verification check for development
        // if (!result.user.isVerified) {
        //     return res.status(403).json({
        //         error: "Please verify your email before logging in",
        //         requiresVerification: true,
        //         redirectUrl: "/verify-email"
        //     });
        // }

        // Load onboarding model dynamically
        const Onboarding = (await import('../Schema/onboarding.schema.js')).default;
        const onboardingData = await Onboarding.findOne({ userId: result.user._id });

        const isOnboardingComplete = onboardingData && onboardingData.isComplete;

        let redirectUrl;

        // ⭐ NEW FINAL RULE — This is what you wanted
        if (isOnboardingComplete || result.user.onboardingCompleted) {
            // Self-healing: If onboarding is complete but user flag is false, fix it
            if (isOnboardingComplete && !result.user.onboardingCompleted) {
                await User.findByIdAndUpdate(result.user._id, { onboardingCompleted: true });
                result.user.onboardingCompleted = true;
                console.log(`Self-healed onboarding status for user ${result.user._id}`);
            }

            // User already completed onboarding → Always go to main dashboard
            redirectUrl = "/main-dashboard";
        } else {
            // User never completed onboarding → Go to onboarding page
            redirectUrl = "/onboarding";
        }

        res.status(200).json({ 
            message: "User logged in successfully",
            user: {
                _id: result.user._id,
                userName: result.user.userName,
                email: result.user.email,
                onboardingCompleted: isOnboardingComplete || result.user.onboardingCompleted,
                hasOnboardingData: !!onboardingData
            },
            token: result.token,
            redirectUrl
        });

    } catch (error) {
        console.error("Login error:", error.message);

        const statusCode = error.message.includes("Invalid username or password")
            ? 401
            : 500;

        res.status(statusCode).json({ 
            error: error.message || "Login failed"
        });
    }
};



export const forgotPasswordController = async (req, res) => {
    try {
        await forgotPassword(req.body.email);
        res.status(200).json({
            message: "Reset link sent to your email",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong!",
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;
        await resetPassword({
            token: token || req.query.token,
            newPassword: password,
        });
        res.status(200).json({
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong!",
        });
    }
};


export const verificationController = async (req, res) => {
    const { token } = req.query;
    try {
        const result = await verifyEmailService(token);
        res.json({ success: true, message: result.message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const resendVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Resend verification requested for:", email);
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const result = await resendVerification(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
