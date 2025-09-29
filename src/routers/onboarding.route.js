import { Router } from "express";
import {
    createOnboardingController,
    getOnboardingDataController,
    updateOnboardingController,
} from "../controllers/onboarding.controller.js";
import performAuthorization from "../middleware/auth.js";

const onboardingRouter = Router();

onboardingRouter.post("/",performAuthorization, createOnboardingController);
onboardingRouter.get("/:userId", performAuthorization,getOnboardingDataController);
onboardingRouter.put("/:userId", performAuthorization,updateOnboardingController);

export default onboardingRouter;