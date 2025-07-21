import { Router } from "express";
import { chatController } from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post("/chat", chatController)


 export default chatRouter
