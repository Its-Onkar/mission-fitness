import { Router } from "express";
import { forgotPasswordController, loginController, resetPasswordController, signupController, verificationController } from "../controllers/auth.controller.js";

 



 const  authRouter= Router()

 authRouter.post("/log-in",loginController)
 authRouter.post("/sign-up",signupController)
 authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/verify-email",verificationController)


  export default authRouter