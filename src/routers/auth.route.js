import { Router } from "express";
import { forgotPasswordController, loginController, resetPasswordController, signupController, verificationController } from "../controllers/auth.controller.js";
import { validateAuth, validateLogin } from "../middleware/validation.js";
import { rateLimit } from "../middleware/rateLimit.js";

const authRouter = Router();

authRouter.post("/log-in", loginController);
authRouter.post("/sign-up", rateLimit(5, 15 * 60 * 1000), validateAuth, signupController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/verify-email", verificationController);

<<<<<<< Updated upstream

 const  authRouter= Router()

 authRouter.post("/log-in",loginController)
 authRouter.post("/sign-up",signupController)
 authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/verify-email",verificationController)


  export default authRouter
=======
export default authRouter;
>>>>>>> Stashed changes
