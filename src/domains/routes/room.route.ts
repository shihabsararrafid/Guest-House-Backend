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
import { checkAuth } from "../../middlewares/auth/checkAuth";

const router = express.Router();
const roomRepository = new RoomRepository(prisma);

const authController = new RoomController(roomRepository);

router.post(
  "/create-room",
  checkAuth(["SUPERADMIN", "RECEPTIONIST"]),
  validateRequest({ schema: createRoomSchema }),
  (req, res, next) => authController.creteRoom(req, res, next)
);
router.get(
  "/get-all-rooms",
  checkAuth(["SUPERADMIN", "RECEPTIONIST"]),
  (req, res, next) => authController.getAllRooms(req, res, next)
);
router.get("/:id", (req, res, next) =>
  authController.getSingleRoom(req, res, next)
);
router.delete(
  "/:id",
  checkAuth(["SUPERADMIN", "RECEPTIONIST"]),
  (req, res, next) => authController.deleteRoom(req, res, next)
);
router.patch(
  "/:id",
  checkAuth(["SUPERADMIN", "RECEPTIONIST"]),
  validateRequest({ schema: updateRoomSchema }),
  (req, res, next) => authController.updateRoom(req, res, next)
);

export default router;
