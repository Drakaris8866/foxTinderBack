import { Router } from "express";
import favoriteController from "../controllers/favoriteController.js";

const favoriteRouter = new Router();

favoriteRouter.get("/getUsers/:_id", favoriteController.getUserCouples);

export default favoriteRouter;
