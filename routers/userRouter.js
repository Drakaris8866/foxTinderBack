import {Router} from "express";
import userController from "../controllers/userController.js";

const userRouter = new Router()

userRouter.put("/updateInfo", userController.updateInfo)
userRouter.put("/updateDislikedInfo/:_id", userController.updatedDislikedUser)
userRouter.put("/updateLikedInfo/:_id", userController.updatedLikedUser)
userRouter.post("/getImage", userController.getRandomImg)
userRouter.delete("/deleteImg/:_id/:imageId", userController.deleteImg)
userRouter.get("/getUsers/:_id", userController.getUsers)
userRouter.get("/getFavoriteUsers/:_id", userController.getFavotiteUsers)

export default userRouter