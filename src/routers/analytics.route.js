import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";
import { rateLimit } from "../middleware/rateLimit.js";

const analyticsRouter = Router();

analyticsRouter.get("/stats", authenticateToken, rateLimit(50), getAnalytics);

export default analyticsRouter;