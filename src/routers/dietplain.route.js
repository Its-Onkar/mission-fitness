import express from "express";
import {
  getDietPlanByUserIdController,
  createDietPlanController,
  updateDietPlanByUserNameController,
  getAllDietPlansController,

} from "../controllers/diet.controller.js";

const dietRouter = express.Router();
dietRouter.post("diet", createDietPlanController);
dietRouter.get("diet/:userId", getDietPlanByUserIdController);
dietRouter.get("diet", getAllDietPlansController);
dietRouter.put("diet/:userName", updateDietPlanByUserNameController);

export default dietRouter;



