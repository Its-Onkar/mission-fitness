
import { BASE_URL } from "../config/variables.js"
import User from "../Schema/user.schema.js"
import { comparePassword, createPasswordHash, generateToken, verifyToken } from "../utils/auth.utils.js"
import { sendEmail } from "../utils/sendEmail.js"
import { createUser, getUserByUserName } from "./user.service.js"

export const signup = async (userData) => {
    try {
        const password = userData.password
        const hashedPassword = await createPasswordHash(password)
        userData.password = hashedPassword
        const newUser = await createUser(userData)

        const token=generateToken({
            userName:newUser.userName,
            email:newUser.email
        },'10m')
        const verifyLink = `${BASE_URL}/auth/verify-email?token=${token}`;
        const to = userData.email
        const subject = "Welcome to  missionFitness " + userData.userName
        const body = `Hello ${userData.userName},\n\nWelcome to missionFitness! We're excited to have you on board.\n\nBest regards,\nThe missionFitness Team\n<h3>Verify your email</h3><p>Click below to verify your email:</p><a href="${verifyLink}">${verifyLink}</a>`
        const cc = null

        await sendEmail({ to, subject, cc, body })
        return newUser

    } catch (error) {
        throw new Error("Failed to create user", error.message);
    }
}

export const login = async (logindata) => {

    try {
        const { userName, password } = logindata
        const user = await getUserByUserName(userName)

        if (!user) {
            throw new Error("User not found")
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }


        const token = generateToken(user)
        if (!token) {
            throw new Error("token not generated")
        }

        return {
            user, token
        }

    } catch (error) {
        throw new Error("Login failed", error.message);
    }
}


export const forgotPassword = async (email) => {
    const user = await User.findOne({
        email,
    });
    if (!user) {
        throw new Error("User Not Found");
    }
    const token = generateToken({ email, tokenType: "forgotPassword" }, "10m");

    await sendEmail({
        subject: "Your password reset link",
        body: `
      <p>Click the link below to reset your password:</p>
      <a href="http://localhost:6001/reset-password?token=${token}>
        Reset Password 
      </a>
      `,
        to: email,
    });
};

export const resetPassword = async ({ token, newPassword }) => {
    const data = verifyToken(token);
    if (!data) {
        throw new Error("Data not found");
    }
    const email = data.email;

    const newpwdhash = createPasswordHash(newPassword);

    await User.findOneAndUpdate(
        {
            email,
        },
        {
            password: newpwdhash,
        },
        {
            new: true,
        }
    );
};



