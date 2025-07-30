import { Router } from "express";
import {
    createOnboardingController,
    getOnboardingDataController,
    updateOnboardingController,
    markOnboardingCompleteController
} from "../controllers/onboarding.controller.js";
import performAuthorization from "../middleware/auth.js";

const onboardingRouter = Router();

onboardingRouter.post("/onboarding",performAuthorization, createOnboardingController);
onboardingRouter.get("/onboarding/:userId", performAuthorization,getOnboardingDataController);
onboardingRouter.put("/onboarding/:userId", performAuthorization,updateOnboardingController);
onboardingRouter.patch("/onboarding/:userId/complete", performAuthorization,markOnboardingCompleteController);

export default onboardingRouter;