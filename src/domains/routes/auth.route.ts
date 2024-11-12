// auth.route.ts
import express from "express";
import { validateRequest } from "../../middlewares/request-validate";
import AuthController from "../../auth/controller/authController";
import AuthRepository from "../../auth/repositories/AuthRepository";
import prisma from "../../libraries/db/prisma";
import { loginSchema, registerSchema } from "../interfaces/auth.interface";
import EmailService from "../services/email.service";
const router = express.Router();
const authRepository = new AuthRepository(prisma);
const emailService = new EmailService();
const authController = new AuthController(authRepository, emailService);

router.post(
  "/register",
  validateRequest({ schema: registerSchema }),
  (req, res, next) => authController.registerUser(req, res, next)
);
router.post(
  "/login",
  validateRequest({ schema: loginSchema }),
  (req, res, next) => authController.loginUser(req, res, next)
);
export default router;
