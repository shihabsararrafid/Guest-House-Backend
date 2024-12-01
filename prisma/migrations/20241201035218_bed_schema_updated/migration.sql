-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomName" TEXT,
ALTER COLUMN "floor" DROP NOT NULL;
