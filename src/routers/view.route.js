import { Router } from "express";
import { homePageController, resetPasswordController,dashboardController, navbarcontroller, signupviewController, onboardingviewController,loginviewController, planResponseController,maindashboardController,verifyemailcontroller,verifiedemailcontroller,dailyActivityViewController} from "../controllers/view.controller.js";
import { authenticateToken, optionalAuth } from "../middleware/tokenAuth.js";
import checkOnboarding from "../middleware/checkonboarding.js";

const viewRouter = Router();

viewRouter.get("/",homePageController);
viewRouter.get("/reset-password",resetPasswordController);
viewRouter.get("/dashboard", dashboardController);
viewRouter.get("/navbar",navbarcontroller);
viewRouter.get("/signup",signupviewController);
viewRouter.get("/onboarding", authenticateToken, onboardingviewController);
viewRouter.get("/login",loginviewController);
viewRouter.get("/plan-response", planResponseController);
viewRouter.get("/main-dashboard", authenticateToken, checkOnboarding, maindashboardController);
viewRouter.get("/daily-activity", authenticateToken, checkOnboarding, dailyActivityViewController);
viewRouter.get("/profile", authenticateToken, (req, res) => {
    res.render("profile", { layout: false });
});
viewRouter.get("/ai-plans", authenticateToken, checkOnboarding, (req, res) => {
    const token = req.token || req.query.token;
    res.render("ai-plans", { token, layout: false });
});
viewRouter.get("/verify-email",verifyemailcontroller);
viewRouter.get("/verified-email",verifiedemailcontroller);

export default viewRouter;
