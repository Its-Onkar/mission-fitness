import { JWT_SECRET } from "../config/variables.js";
import User from "../Schema/user.schema.js";

import { forgotPassword, login, resetPassword, signup, verifyEmailService } from "../services/auth.service.js";


export const signupController = async (req, res) => {
<<<<<<< Updated upstream

    try {
        const userData = req.body
        
        const user = await signup(userData)
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error in signupController:", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
  
    }
=======
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
>>>>>>> Stashed changes

}

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
        
        const redirectUrl = result.user.onboardingCompleted ? "/main-dashboard" : "/onboarding";
        
        res.status(200).json({ 
            message: "User logged in successfully", 
            user: {
                _id: result.user._id,
                userName: result.user.userName,
                email: result.user.email,
                onboardingCompleted: result.user.onboardingCompleted
            },
            token: result.token,
            redirectUrl 
        });
    } catch (error) {
<<<<<<< Updated upstream
        console.error("Error in loginController:", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
=======
        console.error("Login error:", error.message);
        
        // Return appropriate status code based on error type
        const statusCode = error.message.includes("Invalid username or password") ? 401 : 500;
        
        res.status(statusCode).json({ 
            error: error.message || "Login failed"
        });
>>>>>>> Stashed changes
    }
}



export const forgotPasswordController = async (req, res) => {
    try {

        await forgotPassword(req.body.email);
        res.send({
            message: "Otp sent on email",
        });
        // res.send(req.body)
    } catch (error) {
        res.status(500).send({
            message: error.message || "Something went wrong!",
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {

        await resetPassword({
            token: req.query.token,
            newPassword: req.body.newPassword,
        });
        res.send({
            message: "Reset is successful",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Something went wrong!",
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