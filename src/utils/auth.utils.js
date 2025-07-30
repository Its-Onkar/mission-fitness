import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/variables.js";

export const createPasswordHash = (originalPassword) => {
    return bcrypt.hashSync(originalPassword, 10);
};

export const comparePassword = (originalPassword, hashedPassword) => {
    return bcrypt.compareSync(originalPassword, hashedPassword);
};

export const generateToken = (data, expiry) => {
    try {

        if (data && data.toObject) {
            data = data.toObject();
        }

        if (typeof data !== 'object' || data === null) {
            throw new Error("Data must be an object");
        }
        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: expiry || "1h",
        });
        if (!token) {
            throw new Error("Token generation failed");
        }
        return token;
    }
    catch (error) {
        throw new Error({ error: "Token generation failed: ", message: error.message });
    }

};

export const verifyToken = (token) => {
    try {
        const secretKey = JWT_SECRET;
        console.log("Secret Key:", secretKey);
        const data = jwt.verify(token, secretKey);
        return data;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token has expired");
        }
        throw new Error("Invalid token");
    }
};


export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};