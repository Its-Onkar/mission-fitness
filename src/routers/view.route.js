  import { Router } from "express";
import { homePageController, resetPasswordController,dashboardController, navbarcontroller, signupviewController, onboardingviewController,loginviewController } from "../controllers/view.controller.js";
 

  const viewRouter = Router();

  viewRouter.get("/",homePageController)
  viewRouter.get("/reset-password",resetPasswordController)
  viewRouter.get("/dashboard", dashboardController);
  viewRouter.get("/navbar",navbarcontroller);
 viewRouter.get("/signup",signupviewController);
 viewRouter.get ("/onboarding",onboardingviewController)
 viewRouter.get("/login",loginviewController)
  export default viewRouter;