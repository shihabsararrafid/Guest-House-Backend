/*
  Warnings:

  - The `status` column on the `Issues` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Issues` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "roomId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "priority",
ADD COLUMN     "priority" "IssuePriority" NOT NULL DEFAULT 'MEDIUM';

-- CreateIndex
CREATE INDEX "Issues_userId_status_idx" ON "Issues"("userId", "status");

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
