/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `pricePerNight` on the `BookingRoom` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `pricePerNight` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "BookingRoom" ALTER COLUMN "pricePerNight" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "pricePerNight" SET DATA TYPE INTEGER;
