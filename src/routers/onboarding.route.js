import { Router } from "express";
import {
    createOnboardingController,
    getOnboardingDataController,
    updateOnboardingController,
    markOnboardingCompleteController
} from "../controllers/onboarding.controller.js";

const onboardingRouter = Router();

onboardingRouter.post("/onboarding", createOnboardingController);
onboardingRouter.get("/onboarding/:userId", getOnboardingDataController);
onboardingRouter.put("/onboarding/:userId", updateOnboardingController);
onboardingRouter.patch("/onboarding/:userId/complete", markOnboardingCompleteController);

export default onboardingRouter;