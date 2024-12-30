// auth.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { checkAuth } from "../../middlewares/auth/checkAuth";
import { validateRequest } from "../../middlewares/request-validate";
import BookingController from "../controllers/booking.controller";
import {
  bookRoomsSchema,
  getAvailableBookingSchema,
  getBookingsSchemaAdmin,
  getBookingsSchemaUser,
} from "../interfaces/booking.interface";
import BookingRepository from "../repositories/booking.repositories";

const router = express.Router();
const bookingRepository = new BookingRepository(prisma);

const bookingController = new BookingController(bookingRepository);

router.post(
  "/book-rooms",
  checkAuth(),
  validateRequest({ schema: bookRoomsSchema }),
  (req, res, next) => bookingController.bookRooms(req, res, next)
);
router.get(
  "/get-admin-bookings",
  validateRequest({ schema: getBookingsSchemaAdmin, isQuery: true }),
  (req, res, next) => bookingController.getBookedRoomsAdmin(req, res, next)
);
router.get(
  "/get-bookings",
  checkAuth(),
  validateRequest({ schema: getBookingsSchemaUser, isQuery: true }),
  (req, res, next) => bookingController.getBookedRoomsAdmin(req, res, next)
);
router.get(
  "/get-available-rooms",
  validateRequest({ schema: getAvailableBookingSchema, isQuery: true }),
  (req, res, next) => bookingController.getAvailableRooms(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  bookingController.deleteBooking(req, res, next)
);
router.get("/:id", (req, res, next) =>
  bookingController.getSingleBooking(req, res, next)
);
// router.patch(
//   "/:id",
//   validateRequest({ schema: updateRoomSchema }),
//   (req, res, next) => authController.updateRoom(req, res, next)
// );

export default router;
