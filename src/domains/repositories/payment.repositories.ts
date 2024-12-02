import { PaymentTransaction } from "@prisma/client";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";
import { paymentTransactionSchema } from "../interfaces/payment.interface";
import { AppError } from "../../libraries/error-handling/AppError";
import config from "../../configs";
import { AuthPayload } from "../interfaces/auth.interface";
import { createPayment } from "../services/payment.service";

export default class PaymentRepository extends BaseRepository<PaymentTransaction> {
  async getAll(): Promise<Partial<PaymentTransaction>[]> {
    throw new Error("Method not implemented.");
  }
  async getById(): Promise<Partial<PaymentTransaction>> {
    throw new Error("Method not implemented.");
  }
  async createPayment(
    bookingId: string,
    data: z.infer<typeof paymentTransactionSchema>,
    user: AuthPayload
  ): Promise<any> {
    try {
      // Wrap everything in a transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // 1. Check booking
        const booking = await prisma.booking.findUnique({
          where: {
            id: bookingId,
            guestId: user.id,
          },
        });

        if (!booking) {
          throw new AppError("db-error", "Booking Not Found", 404);
        }

        // 2. Create Stripe payment
        const paymentResponse = await createPayment({
          amount: data.amount * 100,
          email: user.email,
          metadata: { bookingId: booking.id }, // Only send necessary booking data
        });

        if (!paymentResponse) {
          throw new AppError("payment-error", "Payment creation failed", 400);
        }

        // 3. Create payment record in database
        const paymentTransaction = await prisma.paymentTransaction.create({
          data: {
            ...data,
            bookingId,
            userId: user.id,
            stripePaymentIntentId: paymentResponse.paymentIntentId,
            stripeCustomerId: paymentResponse.customerId,
            status: "PENDING", // Initial status
          },
        });

        // Return payment response (contains clientSecret for frontend)
        return paymentTransaction;
      });

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get the room info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async delete(): Promise<Partial<PaymentTransaction>> {
    throw new Error("Method not implemented.");
  }
  async update(): Promise<Partial<PaymentTransaction>> {
    throw new Error("Method not implemented.");
  }
}
