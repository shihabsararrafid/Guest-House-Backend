import { z } from "zod";

// Enums matching your Prisma schema
const PaymentStatus = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "CANCELED",
]);
const PaymentType = z.enum(["PAYMENT", "REFUND", "CHARGEBACK"]);

// Base payment transaction schema
export const paymentTransactionSchema = z.object({
  id: z.string().uuid().optional(), // optional because it's generated
  amount: z.number().int().positive(), // amount in cents
  currency: z.string().default("USD"),
  status: PaymentStatus.default("PENDING"),
  type: PaymentType.default("PAYMENT"),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  //   userId: z.string().uuid(),

  // Stripe specific fields you might want to add
  stripePaymentIntentId: z.string().optional(), // PI_123...
  stripeCustomerId: z.string().optional(), // cus_123...
  stripePaymentMethodId: z.string().optional(), // pm_123...
  stripeFees: z.number().int().optional(), // in cents
  stripeReceiptUrl: z.string().url().optional(),
  last4: z.string().length(4).optional(), // last 4 digits of card
  paymentMethod: z.enum(["card", "bank_transfer", "wallet"]).optional(),

  // Optional: Add validation for specific card brands if needed
  cardBrand: z
    .enum(["visa", "mastercard", "amex", "discover", "other"])
    .optional(),
});
export const confirmPaymentTransactionSchema = z.object({
  status: PaymentStatus.default("COMPLETED"),
});
