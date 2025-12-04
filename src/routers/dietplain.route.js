import express from "express";
import {
  getDietPlanByUserIdController,
  createDietPlanController,
  updateDietPlanByUserNameController,
<<<<<<< Updated upstream
  getAllDietPlansController,

=======
  logFoodController,
  getDietComparisonController
>>>>>>> Stashed changes
} from "../controllers/diet.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const dietRouter = express.Router();
<<<<<<< Updated upstream
dietRouter.post("diet", createDietPlanController);
dietRouter.get("diet/:userId", getDietPlanByUserIdController);
dietRouter.get("diet", getAllDietPlansController);
dietRouter.put("diet/:userName", updateDietPlanByUserNameController);
=======
dietRouter.post("/diet", createDietPlanController);
dietRouter.get("/diet/:userId", getDietPlanByUserIdController);
dietRouter.put("/diet/:userName", updateDietPlanByUserNameController);
dietRouter.post("/log-food", authenticateToken, logFoodController);
dietRouter.get("/comparison", authenticateToken, getDietComparisonController);
>>>>>>> Stashed changes

export default dietRouter;



