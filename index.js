import express from "express";
import mongoose from "mongoose";
import authRouter from "./routers/authRouter.js";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import upload from "./utils/upload.js";
import onConnection from "./socket_io/onConnection.js";
import { createServer } from "http";
import { Server } from "socket.io";
import favoriteRouter from "./routers/favoriteRouter.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/favorite", favoriteRouter);
app.use("upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.sendStatus(400);

  const relativeFilePath = req.file.path
    .replace(/\\/g, "/")
    .split("/server/files")[1];

  res.status(200).json(relativeFilePath);
});
app.use("files", (req, res) => {
  const filePath = getFilePath(req.url);

  res.status(200).sendFile(filePath);
});

const PORT = 5000;

const server = createServer(app);

const io = new Server(server, {
  cors: "http://localhost:3000",
  serveClient: false,
});

io.on("connection", (socket) => {
  onConnection(io, socket);
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Drakaris8866:jBdnwh2takMfnnpV@cluster0.bzxpqf7.mongodb.net/tinder?retryWrites=true&w=majority"
    );
    server.listen(PORT, () => "Server working");
  } catch (e) {
    console.log(e);
  }
};

start();
