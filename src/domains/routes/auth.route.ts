// auth.route.ts
import express from "express";
import { validateRequest } from "../../middlewares/request-validate";
import AuthController from "../../auth/controller/authController";
import AuthRepository from "../../auth/repositories/AuthRepository";
import prisma from "../../libraries/db/prisma";
import { registerSchema } from "../interfaces/auth.interface";
const router = express.Router();
const authRepository = new AuthRepository(prisma);
const authController = new AuthController(authRepository);

router.post(
  "/register",
  validateRequest({ schema: registerSchema }),
  (req, res, next) => authController.registerUser(req, res, next)
);

export default router;
