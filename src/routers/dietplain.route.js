import express from "express";
import {
  getDietPlanByUserIdController,
  createDietPlanController,
  updateDietPlanByUserNameController,

} from "../controllers/diet.controller.js";

const dietRouter = express.Router();
dietRouter.post("diet", createDietPlanController);
dietRouter.get("diet/:userId", getDietPlanByUserIdController);
dietRouter.put("diet/:userName", updateDietPlanByUserNameController);

export default dietRouter;



