/*
  Warnings:

  - You are about to drop the column `roomId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomId_fkey";

-- DropIndex
DROP INDEX "Booking_roomId_guestId_checkIn_checkOut_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "roomId",
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "discountType" TEXT NOT NULL,
ALTER COLUMN "numberOfGuests" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_BookingToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToRoom_AB_unique" ON "_BookingToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToRoom_B_index" ON "_BookingToRoom"("B");

-- CreateIndex
CREATE INDEX "Booking_guestId_checkIn_checkOut_idx" ON "Booking"("guestId", "checkIn", "checkOut");

-- AddForeignKey
ALTER TABLE "_BookingToRoom" ADD CONSTRAINT "_BookingToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToRoom" ADD CONSTRAINT "_BookingToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
