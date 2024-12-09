import { PaymentTransaction } from "@prisma/client";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";
import {
  confirmPaymentTransactionSchema,
  paymentTransactionSchema,
} from "../interfaces/payment.interface";
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
          amount:
            (typeof data.amount === "string"
              ? parseInt(data.amount)
              : data.amount) * 100,
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
        return {
          ...paymentTransaction,
          client_secret: paymentResponse.clientSecret,
        };
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
  async confirmPayment(
    paymentId: string,
    data: z.infer<typeof confirmPaymentTransactionSchema>,
    user: AuthPayload
  ): Promise<any> {
    try {
      // Wrap everything in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Check booking
        const transaction = await tx.paymentTransaction.findUnique({
          where: {
            id: paymentId,
            userId: user.id,
          },
        });

        if (!transaction) {
          throw new AppError("db-error", "Payment transaction Not Found", 404);
        }

        const booking = await tx.booking.findUnique({
          where: {
            id: transaction.bookingId,
          },
        });
        if (booking) {
          const paidAmount = transaction.amount + booking?.paidAmount;
          const b = await tx.booking.update({
            where: {
              id: transaction.bookingId,
            },
            data: {
              status: "CONFIRMED",
              paidAmount,
              isPaid:
                paidAmount === booking.totalPriceWithDiscount ? true : false,
            },
          });
        }
        const paymentTransaction = await tx.paymentTransaction.update({
          where: {
            id: paymentId,
            userId: user.id,
          },
          data: data,
          include: {
            booking: {
              include: {
                rooms: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
        });

        // Return payment response (contains clientSecret for frontend)
        return {
          ...paymentTransaction,
        };
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
