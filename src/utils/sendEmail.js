import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/variables.js";


const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
       user: EMAIL_USER,
       pass: EMAIL_PASS
    }
})


export const sendEmail = async ({to, subject, cc, body}) => {
    try {
        await transport.sendMail({
            from: EMAIL_USER,
            to: to,
            cc: cc||null,
            subject,
            html: body,
        });
    } catch (error) {
        console.error("Error sending email:", error.message);
        if (error.response) {
            console.error("SMTP Response:", error.response);
        }
        throw new Error("Failed to send email. Please check your credentials or email configuration.");
    }
}