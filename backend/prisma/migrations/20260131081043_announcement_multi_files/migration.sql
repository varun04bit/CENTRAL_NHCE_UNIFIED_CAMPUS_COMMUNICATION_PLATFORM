/*
  Warnings:

  - You are about to drop the column `uploadedFileId` on the `Announcement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_uploadedFileId_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "uploadedFileId";

-- AlterTable
ALTER TABLE "UploadedFile" ADD COLUMN     "announcementId" TEXT;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
