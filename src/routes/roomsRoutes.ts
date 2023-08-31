import { Router } from "express";
import {getRoomsController, getSingleRoomController, createRoomController, updateRoomController, deleteRoomController } from "../controllers/roomsController";



const roomsRouter = Router();
roomsRouter.get("/", getRoomsController );
roomsRouter.get("/:roomId", getSingleRoomController);
roomsRouter.post("/", createRoomController);
roomsRouter.put("/:roomId", updateRoomController);
roomsRouter.delete("/:roomId", deleteRoomController);


export {roomsRouter}