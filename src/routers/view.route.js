  import { Router } from "express";
import { homePageController, resetPasswordController } from "../controllers/view.controller.js";

  const viewRouter = Router();

  viewRouter.get("/",homePageController)
  viewRouter.get("/reset-password",resetPasswordController)


  export default viewRouter;