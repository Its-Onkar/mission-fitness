import { Router } from "express";

import performAuthorization from "../middleware/auth.js";
import { fitnessController } from "../controllers/fitness.controller.js";

const fitnessRouter = Router();

fitnessRouter.post("/fitness",performAuthorization, fitnessController);


export default fitnessRouter;