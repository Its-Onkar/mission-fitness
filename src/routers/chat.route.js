import { Router } from "express";
import { chatController, fitnessExpertChat } from "../controllers/chat.controller.js";
import performAuthorization from "../middleware/auth.js";

const chatRouter = Router();

chatRouter.post("/chat", performAuthorization, chatController);
chatRouter.post("/fitness-expert", performAuthorization, fitnessExpertChat);

export default chatRouter;
