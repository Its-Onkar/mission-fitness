import { Router } from "express";
import { logFoodController, getDietComparisonController } from "../controllers/diet.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const dietRouter = Router();

dietRouter.post("/log-food", authenticateToken, logFoodController);
dietRouter.get("/comparison", authenticateToken, getDietComparisonController);

export default dietRouter;