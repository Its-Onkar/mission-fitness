import express from "express";
import {
  getDietPlanByUserIdController,
  createDietPlanController,
  updateDietPlanByUserNameController,

  getAllDietPlansController,


  logFoodController,
  getDietComparisonController

} from "../controllers/diet.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";

const dietRouter = express.Router();

dietRouter.post("diet", createDietPlanController);
dietRouter.get("diet/:userId", getDietPlanByUserIdController);
dietRouter.get("diet", getAllDietPlansController);
dietRouter.put("diet/:userName", updateDietPlanByUserNameController);

dietRouter.post("/diet", createDietPlanController);
dietRouter.get("/diet/:userId", getDietPlanByUserIdController);
dietRouter.put("/diet/:userName", updateDietPlanByUserNameController);
dietRouter.post("/log-food", authenticateToken, logFoodController);
dietRouter.get("/comparison", authenticateToken, getDietComparisonController);


export default dietRouter;



