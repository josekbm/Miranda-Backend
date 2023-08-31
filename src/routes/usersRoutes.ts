import { Router } from "express";
import {getUsersController, getSingleUserController, updateUserController, deleteUserController, createUserController } from "../controllers/usersController";



const usersRouter = Router();
usersRouter.get("/", getUsersController );
usersRouter.get("/:userId", getSingleUserController);
usersRouter.post("/", createUserController);
usersRouter.put("/:userId", updateUserController);
usersRouter.delete("/:userId", deleteUserController);


export {usersRouter}