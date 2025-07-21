import { Router } from "express";
import { forgotPasswordController, loginController, resetPasswordController, signupController } from "../controllers/auth.controller.js";

 



 const  authRouter= Router()

 authRouter.post("/auth/log-in",loginController)
 authRouter.post("/auth/sign-up",signupController)
 authRouter.post("/auth/forgot-password", forgotPasswordController);
authRouter.post("/auth/reset-password", resetPasswordController);

  export default authRouter