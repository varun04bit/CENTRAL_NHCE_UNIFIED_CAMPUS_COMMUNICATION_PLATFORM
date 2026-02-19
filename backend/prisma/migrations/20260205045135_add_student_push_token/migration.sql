-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "expoPushToken" TEXT,
ADD COLUMN     "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushTokenUpdatedAt" TIMESTAMP(3);
