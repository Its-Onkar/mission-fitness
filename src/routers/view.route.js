  import { Router } from "express";
import { homePageController, resetPasswordController,dashboardController, navbarcontroller, signupviewController } from "../controllers/view.controller.js";
 

  const viewRouter = Router();

  viewRouter.get("/",homePageController)
  viewRouter.get("/reset-password",resetPasswordController)
  viewRouter.get("/dashboard", dashboardController);
  viewRouter.get("/navbar",navbarcontroller);
 viewRouter.get("/signup",signupviewController)
  export default viewRouter;