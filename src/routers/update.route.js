import { Router } from "express";
import { updatePlanController } from "../controllers/update.controller.js";
import performAuthorization from "../middleware/auth.js";

const updateRouter = Router();

updateRouter.post("/update-plan", performAuthorization, updatePlanController);

export default updateRouter;