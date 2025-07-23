import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import performAuthorization from "../middleware/auth.js";

const chatRouter = Router();

chatRouter.post("/chat", performAuthorization,chatController)


 export default chatRouter
