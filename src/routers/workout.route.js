import { Router } from "express";
import { createWorkoutPlanController,getWorkoutPlanByUserIdController,updateWorkoutPlanByUserNameController } from "../controllers/workout.controller.js";

const workoutRouter = Router();
workoutRouter.post("/workout", createWorkoutPlanController);

workoutRouter.get("/workout/:userId", getWorkoutPlanByUserIdController);
workoutRouter.put("/workout/:userName", updateWorkoutPlanByUserNameController);

export default workoutRouter;