// auth.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { validateRequest } from "../../middlewares/request-validate";
import RoomController from "../controllers/room.controller";
import {
  createRoomSchema,
  updateRoomSchema,
} from "../interfaces/room.interface";
import RoomRepository from "../repositories/room.repositories";
import BookingRepository from "../repositories/booking.repositories";
import BookingController from "../controllers/booking.controller";
import { getAvailableBookingSchema } from "../interfaces/booking.interface";

const router = express.Router();
const bookingRepository = new BookingRepository(prisma);

const bookingController = new BookingController(bookingRepository);

// router.post(
//   "/create-room",
//   validateRequest({ schema: createRoomSchema }),
//   (req, res, next) => authController.creteRoom(req, res, next)
// );
// router.get("/get-all-rooms", (req, res, next) =>
//   authController.getAllRooms(req, res, next)
// );
router.get(
  "/get-available-rooms",
  validateRequest({ schema: getAvailableBookingSchema, isQuery: true }),
  (req, res, next) => bookingController.getAvailableRooms(req, res, next)
);
// router.delete("/:id", (req, res, next) =>
//   authController.deleteRoom(req, res, next)
// );
// router.patch(
//   "/:id",
//   validateRequest({ schema: updateRoomSchema }),
//   (req, res, next) => authController.updateRoom(req, res, next)
// );

export default router;
