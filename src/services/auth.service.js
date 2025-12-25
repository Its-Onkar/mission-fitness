
import { BASE_URL } from "../config/variables.js"
import User from "../Schema/user.schema.js"

import { comparePassword, createPasswordHash, generateToken, verifyToken } from "../utils/auth.utils.js"
import { sendEmail } from "../utils/sendEmail.js"
import { createUser, getUserByUserName } from "./user.services.js"
import {VerifyToken} from "../Schema/token.schema.js"

export const signup = async (userData) => {
    try {

        if(!userData.userName || !userData.email || !userData.password){
            throw new Error("All fields are required")
        }

        // email 
        const existingUserByEmail = await User.findOne({ email: userData.email });
        if (existingUserByEmail) {
            throw new Error("Email already exists");
        }

// has

        const password = userData.password
        const hashedPassword = createPasswordHash(password)
        userData.password = hashedPassword
        const newUser = await createUser(userData) 

        const token = generateToken({
            userName: newUser.userName,
            email: newUser.email
        }, 7 * 24 * 60 * 60)
        await VerifyToken.create({
            userId: newUser._id,
            token: token
        })
        
        const verifyLink = `${BASE_URL}/verify-email?token=${token}`;
        const to = userData.email
        const subject = "Verify your email | " + userData.userName
        const body = `Hello ${userData.userName},\n\nWelcome to missionFitness! We're excited to have you on board.\n\nBest regards,\nThe missionFitness Team\n<h3>Verify your email</h3><p>Click below to verify your email:</p><a href="${verifyLink}">${verifyLink}</a>`
        const cc = null

        await sendEmail({ to, subject, cc, body })
        return {newUser, token}

    } catch (error) {
        console.error("Error in signup service:", error.message);
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

export const verifyEmailService = async (token) => {
  try {
    // find token in DB
    const tokenDoc = await VerifyToken.findOne({ token });

    if (!tokenDoc) {
      throw new Error("Invalid or expired verification link");
    }
    
    // verify token
    const decoded = verifyToken(tokenDoc.token);
    
    // mark user as verified
    await User.findOneAndUpdate(
      { email: decoded.email },
      { isVerified: true, status: "active" }
    );

    // delete token after success
    await VerifyToken.findByIdAndDelete(tokenDoc._id);

    return {
      success: true,
      message: "Email verified successfully!",
    };

  } catch (error) {
    throw new Error(error.message || "Verification failed");
  }
};


export const login = async (logindata) => {
    try {
        const { userName, password } = logindata;
        
        if (!userName || !password) {
            throw new Error("Username and password are required");
        }
        
        console.log("Attempting login for:", userName);
        
        // Try case-insensitive username lookup
        const user = await User.findOne({ 
            userName: { $regex: new RegExp(`^${userName}$`, 'i') } 
        });
        
        console.log("User found:", user ? "Yes" : "No");


        if (!user) {
            throw new Error("Invalid username or password");
        }

        // Check if user is active
        if (user.status !== 'active') {
            throw new Error("Account is inactive. Please contact support.");
        }

        // Skip verification check for development
        // if (!user.isVerified) {
        //     throw new Error("Please verify your email before logging in");
        // }

        const isPasswordValid = await comparePassword(password, user.password);
        console.log("Password valid:", isPasswordValid);
        
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }

        const token = generateToken(user, "1d");
        console.log("Token generated:", token ? "Yes" : "No");
        
        if (!token) {
            throw new Error("Token generation failed");
        }

console.log("token:", token);
        console.log("user:", user);
        console.log("mydata:",  {
            user, token
        });


       
        return { user, token };

    } catch (error) {
        console.error("Login service error:", error.message);
        throw new Error(error.message);
    }
}


import crypto from 'crypto';

export const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User Not Found");
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token to DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const resetLink = `${BASE_URL}/reset-password?token=${token}`;

    await sendEmail({
        subject: "Reset Your Password | Mission Fitness",
        body: `
            <h3>Password Reset Request</h3>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        `,
        to: email,
    });
};

export const resetPassword = async ({ token, newPassword }) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error("Password reset token is invalid or has expired");
    }

    const newpwdhash = await createPasswordHash(newPassword);

    user.password = newpwdhash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
};



export const resendVerification = async (email) => {
    try {
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.isVerified) {
            throw new Error("Email is already verified");
        }

        // Delete existing token if any
        await VerifyToken.findOneAndDelete({ userId: user._id });

        // Generate new token
        const token = generateToken({
            userName: user.userName,
            email: user.email
        }, 7 * 24 * 60 * 60);

        // Save new token
        await VerifyToken.create({
            userId: user._id,
            token: token
        });

        const verifyLink = `${BASE_URL}/verify-email?token=${token}`;
        const to = user.email;
        const subject = "Verify your email | " + user.userName;
        const body = `Hello ${user.userName},\n\nHere is your new verification link.\n\nBest regards,\nThe missionFitness Team\n<h3>Verify your email</h3><p>Click below to verify your email:</p><a href="${verifyLink}">${verifyLink}</a>`;
        
        await sendEmail({ to, subject, body });

        return { message: "Verification email sent successfully" };

    } catch (error) {
        throw new Error(error.message);
    }
};
