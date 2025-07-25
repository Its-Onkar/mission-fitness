import { JWT_SECRET } from "../config/variables.js";
import User from "../Schema/user.schema.js";
import { forgotPassword, login, resetPassword, signup } from "../services/auth.service.js";
import { verifyToken } from "../utils/auth.utils.js";

export const signupController = async (req, res) => {

    try {
        const userData = req.body
        console.log("User data in signupController:", userData);

        const user = await signup(userData)
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error in signupController:", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message || "Internal Server Error" });
    }

}

export const loginController = async (req, res) => {

    try {
        const userData = req.body
        const user = await login(userData)
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.error("Error in loginController:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
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
        const { email, userName } = verifyToken(token, JWT_SECRET);
        const user = await User.findOne({ email, userName, isVerified: false })
        if (!user) return res.send('Invalid link');

        user.isVerified = true;
        await user.save();

        res.render('verify-email', { success: true });
    } catch (err) {
        res.render('verify-email', { success: false });
    }
}