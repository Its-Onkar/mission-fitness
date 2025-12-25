import { Router } from "express";
import { testEmailNotification, testMissedActivities, testPerformanceData, testDailyPlanGeneration } from "../controllers/test.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const testRouter = Router();

testRouter.post("/email", authenticateToken, testEmailNotification);
testRouter.post("/missed-activities", authenticateToken, testMissedActivities);
testRouter.post("/performance-data", authenticateToken, testPerformanceData);
testRouter.post("/daily-plan-gen", authenticateToken, testDailyPlanGeneration);

export default testRouter;
