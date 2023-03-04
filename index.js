import express from 'express';
import mongoose from "mongoose";
import authRouter from "./routers/authRouter.js";
import cors from 'cors'
import userRouter from "./routers/userRouter.js";

const app = express()

app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)
app.use("/user", userRouter)

const PORT = 5000

const start = async () => {
    try{
        await mongoose.connect("mongodb+srv://Drakaris8866:jBdnwh2takMfnnpV@cluster0.bzxpqf7.mongodb.net/tinder?retryWrites=true&w=majority")
        app.listen(PORT, () => "Server working")
    } catch (e) {
        console.log(e)
    }

}

start()
