import Stripe from "stripe";
import config from "../../configs";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
export class WebhookController extends BaseController {
  private stripe: Stripe;
  protected prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    super();
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY);
    this.prisma = prisma;
  }

  async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("herre");
      // 1. Verify webhook signature
      const sig = req.headers["stripe-signature"];
      console.log(sig, "ds", req.body);
      if (!sig) throw new AppError("Webhook Error", "", 500);
      const event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_616e43f2c4d8e13078a86a48e36d20f8ac7035e7b1232a7294bfd30ce59184fe"
        // config.STRIPE_WEBHOOK_SECRET
      );

      // 2. Handle different event types
      await this.handleWebhookEvent(event);

      return { received: true };
    } catch (err) {
      console.error(err);
      throw new AppError("WebHook Error", "", 500);
    }
  }

  private async handleWebhookEvent(event: Stripe.Event) {
    console.log(event.type);
    // 3. Use prisma transaction to update both payment and booking
    await this.prisma.$transaction(async (prisma) => {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log("succceeded");
          // Update payment transaction
          const payment = await prisma.paymentTransaction.update({
            where: {
              stripePaymentIntentId: paymentIntent.id,
            },
            data: {
              status: "COMPLETED",
            },
          });

          break;

        case "payment_intent.payment_failed":
          const failedPayment = event.data.object as Stripe.PaymentIntent;

          const updatedPayment = await prisma.paymentTransaction.update({
            where: {
              stripePaymentIntentId: failedPayment.id,
            },
            data: {
              status: "FAILED",
              errorMessage: failedPayment.last_payment_error?.message,
            },
          });

          break;

        // Add more cases as needed
        case "payment_intent.processing":
          await this.prisma.paymentTransaction.update({
            where: {
              stripePaymentIntentId: event.data.object.id,
            },
            data: {
              status: "PROCESSING",
            },
          });
          break;
      }
    });
  }
}
