// auth.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { validateRequest } from "../../middlewares/request-validate";
import RoomController from "../controllers/room.controller";
import { createRoomSchema } from "../interfaces/room.interface";
import RoomRepository from "../repositories/room.repositories";

const router = express.Router();
const roomRepository = new RoomRepository(prisma);

const authController = new RoomController(roomRepository);

router.post(
  "/create-room",
  validateRequest({ schema: createRoomSchema }),
  (req, res, next) => authController.creteRoom(req, res, next)
);

export default router;
