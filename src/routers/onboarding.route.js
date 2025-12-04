import { Router } from "express";
import {
    createOnboardingController,
    getOnboardingDataController,
    updateOnboardingController,
    getAIRecommendations,
} from "../controllers/onboarding.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";
import { validateOnboarding } from "../middleware/validation.js";
import { rateLimit } from "../middleware/rateLimit.js";

const onboardingRouter = Router();

<<<<<<< Updated upstream
onboardingRouter.post("/onboarding",performAuthorization, createOnboardingController);
onboardingRouter.get("/onboarding/:userId", performAuthorization,getOnboardingDataController);
onboardingRouter.put("/onboarding/:userId", performAuthorization,updateOnboardingController);
=======
onboardingRouter.post("/", authenticateToken, validateOnboarding, createOnboardingController);
onboardingRouter.post("/ai-recommendations", authenticateToken, rateLimit(5), getAIRecommendations);
onboardingRouter.get("/:userId", authenticateToken, getOnboardingDataController);
onboardingRouter.put("/:userId", authenticateToken, validateOnboarding, updateOnboardingController);
>>>>>>> Stashed changes

export default onboardingRouter;