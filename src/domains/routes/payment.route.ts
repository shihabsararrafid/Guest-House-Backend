// auth.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { checkAuth } from "../../middlewares/auth/checkAuth";
import { validateRequest } from "../../middlewares/request-validate";
import PaymentController from "../controllers/payment.controller";
import { paymentTransactionSchema } from "../interfaces/payment.interface";
import PaymentRepository from "../repositories/payment.repositories";

const router = express.Router();
const paymentRepository = new PaymentRepository(prisma);

const paymentController = new PaymentController(paymentRepository);

router.post(
  "/make-payment/:bookingId",
  checkAuth(["SUPERADMIN", "USER"]),
  validateRequest({ schema: paymentTransactionSchema }),
  (req, res, next) => paymentController.createPayments(req, res, next)
);

export default router;
