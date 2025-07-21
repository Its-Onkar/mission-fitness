import {Router} from "express"

import {  createUserController, deleteUserByIdController, getAllUsersController, getUserByIdController, getUserByUserNameController, updateUserByUserNameController } from "../controllers/user.controller.js"
import { userByIdValidation, userByUserNameValidation, userValidation } from "../middleware/validation.js"


const userRouter=Router()


userRouter.post("/users",userValidation , createUserController)
userRouter.get("/users",getAllUsersController)
userRouter.get("/users/:userName",userByUserNameValidation ,getUserByUserNameController)
userRouter.get("/users/:id",userByIdValidation,getUserByIdController)
userRouter.put("/users/:userName",userByUserNameValidation ,updateUserByUserNameController)
userRouter.delete("/users/:id", userByIdValidation,deleteUserByIdController)



export default userRouter
