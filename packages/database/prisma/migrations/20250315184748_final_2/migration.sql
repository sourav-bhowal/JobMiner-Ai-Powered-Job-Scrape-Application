/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `scraped_jobs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "scraped_jobs_expiresAt_idx";

-- AlterTable
ALTER TABLE "scraped_jobs" DROP COLUMN "expiresAt";

-- CreateIndex
CREATE INDEX "scraped_jobs_createdAt_idx" ON "scraped_jobs"("createdAt");
