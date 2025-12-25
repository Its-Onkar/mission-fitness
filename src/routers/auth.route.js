import { Router } from "express";
import { forgotPasswordController, loginController, resetPasswordController, signupController, verificationController, resendVerificationController } from "../controllers/auth.controller.js";
import { validateAuth, validateLogin } from "../middleware/validation.js";
import { rateLimit } from "../middleware/rateLimit.js";

const authRouter = Router();

authRouter.post("/log-in", loginController);
authRouter.post("/sign-up", rateLimit(5, 15 * 60 * 1000), validateAuth, signupController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/verify-email", verificationController);
authRouter.post("/resend-verification", resendVerificationController);

export default authRouter;