/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "cardBrand" TEXT,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "last4" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeFees" INTEGER,
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripePaymentMethodId" TEXT,
ADD COLUMN     "stripeReceiptUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_stripePaymentIntentId_key" ON "payment_transactions"("stripePaymentIntentId");

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
