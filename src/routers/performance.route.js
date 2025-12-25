import { Router } from "express";
import { completeWorkout, completeDiet, getPerformanceData, getPerformanceStats, testAuth } from "../controllers/performance.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const performanceRouter = Router();

performanceRouter.post("/workout/complete", authenticateToken, completeWorkout);
performanceRouter.post("/diet/complete", authenticateToken, completeDiet);
performanceRouter.get("/data", authenticateToken, getPerformanceStats);
performanceRouter.get("/history", authenticateToken, getPerformanceData);
performanceRouter.get("/test-auth", authenticateToken, testAuth);

export default performanceRouter;
