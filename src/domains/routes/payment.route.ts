// auth.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { checkAuth } from "../../middlewares/auth/checkAuth";
import { validateRequest } from "../../middlewares/request-validate";
import PaymentController from "../controllers/payment.controller";
import {
  confirmPaymentTransactionSchema,
  paymentTransactionSchema,
} from "../interfaces/payment.interface";
import PaymentRepository from "../repositories/payment.repositories";
import { WebhookController } from "../controllers/webhook.controller";

const router = express.Router();
const paymentRepository = new PaymentRepository(prisma);
const webHookController = new WebhookController(prisma);

const paymentController = new PaymentController(paymentRepository);

router.post(
  "/make-payment/:bookingId",
  checkAuth(["SUPERADMIN", "USER"]),
  validateRequest({ schema: paymentTransactionSchema }),
  (req, res, next) => paymentController.createPayments(req, res, next)
);
router.post(
  "/confirm-payment/:paymentId",
  checkAuth(["SUPERADMIN", "USER"]),
  validateRequest({ schema: confirmPaymentTransactionSchema }),
  (req, res, next) => paymentController.confirmPayment(req, res, next)
);
router.post("/webhook", (req, res, next) =>
  webHookController.handleStripeWebhook(req, res, next)
);

export default router;
