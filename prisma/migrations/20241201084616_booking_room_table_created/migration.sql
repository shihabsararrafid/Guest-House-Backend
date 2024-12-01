/*
  Warnings:

  - You are about to drop the column `numberOfGuests` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `specialRequests` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `_BookingToRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookingToRoom" DROP CONSTRAINT "_BookingToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToRoom" DROP CONSTRAINT "_BookingToRoom_B_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "numberOfGuests",
DROP COLUMN "specialRequests";

-- DropTable
DROP TABLE "_BookingToRoom";

-- CreateTable
CREATE TABLE "BookingRoom" (
    "bookingId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "pricePerNight" DECIMAL(10,2) NOT NULL,
    "numberOfGuests" INTEGER,
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingRoom_pkey" PRIMARY KEY ("bookingId","roomId")
);

-- CreateIndex
CREATE INDEX "BookingRoom_bookingId_idx" ON "BookingRoom"("bookingId");

-- CreateIndex
CREATE INDEX "BookingRoom_roomId_idx" ON "BookingRoom"("roomId");

-- AddForeignKey
ALTER TABLE "BookingRoom" ADD CONSTRAINT "BookingRoom_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRoom" ADD CONSTRAINT "BookingRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
