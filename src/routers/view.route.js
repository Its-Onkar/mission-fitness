import { Router } from "express";
import { homePageController, resetPasswordController, forgotPasswordController, dashboardController, navbarcontroller, signupviewController, onboardingviewController,loginviewController, planResponseController,maindashboardController,verifyemailcontroller,verifiedemailcontroller,dailyActivityViewController,dashboardDataController} from "../controllers/view.controller.js";
import { authenticateToken, optionalAuth } from "../middleware/tokenAuth.js";
import checkOnboarding from "../middleware/checkonboarding.js";
import { checkUserFlow } from "../middleware/userFlow.js";

const viewRouter = Router();

viewRouter.get("/",homePageController);
viewRouter.get("/forgot-password", forgotPasswordController);
viewRouter.get("/reset-password",resetPasswordController);
viewRouter.get("/dashboard", dashboardController);
viewRouter.get("/navbar",navbarcontroller);
viewRouter.get("/signup",signupviewController);
viewRouter.get("/onboarding", authenticateToken, checkUserFlow, (req, res) => {
    const token = req.token || req.query.token;
    res.render("onboarding", { token, layout: false });
});
viewRouter.get("/login", loginviewController);
viewRouter.get("/signin", loginviewController);
viewRouter.get("/plan-response", planResponseController);
viewRouter.get("/main-dashboard", authenticateToken, checkUserFlow, (req, res) => {
    const token = req.token || req.query.token;
    res.render("maindashboard", { token, layout: false });
});
viewRouter.get("/daily-activity", authenticateToken, checkOnboarding, dailyActivityViewController);
viewRouter.get("/profile", authenticateToken, (req, res) => {
    res.render("profile", { layout: false });
});
viewRouter.get("/ai-plans", authenticateToken, checkUserFlow, (req, res) => {
    try {
        const token = req.token || req.query.token;
        res.render("ai-plans", { token, layout: false });
    } catch (error) {
        console.error("Error rendering ai-plans:", error);
        res.status(500).send("Error rendering page: " + error.message);
    }
});
viewRouter.get("/verify-email",verifyemailcontroller);
viewRouter.get("/verified-email",verifiedemailcontroller);
viewRouter.get("/api/dashboard-data", authenticateToken, dashboardDataController);

export default viewRouter;
