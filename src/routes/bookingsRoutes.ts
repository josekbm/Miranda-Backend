import { Router } from "express";
import {getBookingsController, getSingleBookingController, updateBookingController, deleteBookingController, createBookingController } from "../controllers/bookingsController";


const bookingsRouter = Router();
bookingsRouter.get("/", getBookingsController);
bookingsRouter.get("/:bookingId", getSingleBookingController);
bookingsRouter.post("/", createBookingController);
bookingsRouter.put("/:bookingId", updateBookingController);
bookingsRouter.delete("/:bookingId", deleteBookingController);


export {bookingsRouter}