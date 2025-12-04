import { Router } from "express";
import { createUserController, deleteUserByIdController, getAllUsersController, getUserByIdController, getUserByUserNameController, updateUserByUserNameController, updateProfileController, getProfileDataController, getDashboardDataController } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/tokenAuth.js";
import upload from "../middleware/upload.middleware.js";


const userRouter = Router();

userRouter.post("/users", createUserController);
userRouter.get("/users", getAllUsersController);
userRouter.get("/users/:userName", getUserByUserNameController);
userRouter.get("/users/:id", getUserByIdController);
userRouter.put("/users/:userName", updateUserByUserNameController);
userRouter.delete("/users/:id", deleteUserByIdController);

userRouter.post("/profile", authenticateToken, upload.single("profileImage"), updateProfileController);
userRouter.get("/profile", authenticateToken, getProfileDataController);

// Dashboard Routes
userRouter.get("/dashboard-data", authenticateToken, getDashboardDataController);


export default userRouter;
