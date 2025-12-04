import { Router } from "express";
import { logWeightController, getWeightHistoryController, getWeightProgressController } from "../controllers/weight.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const weightRouter = Router();

weightRouter.post("/log", authenticateToken, logWeightController);
weightRouter.get("/history", authenticateToken, getWeightHistoryController);
weightRouter.get("/progress", authenticateToken, getWeightProgressController);

export default weightRouter;