/*
  Warnings:

  - Added the required column `embedding` to the `scraped_jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scraped_jobs" ADD COLUMN     "embedding" vector(1536) NOT NULL;
