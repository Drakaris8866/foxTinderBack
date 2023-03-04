import {Router} from "express";
import userController from "../controllers/userController.js";

const userRouter = new Router()

userRouter.put("/updateInfo", userController.updateInfo)
userRouter.post("/getImage", userController.getRandomImg)
userRouter.delete("/deleteImg/:_id/:imageId", userController.deleteImg)
userRouter.get("/getUsers", userController.getUsers)

export default userRouter