-- CreateTable
CREATE TABLE "scraped_jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "companyName" TEXT,
    "companyLink" TEXT,
    "jobType" TEXT,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "remote" BOOLEAN DEFAULT false,
    "location" TEXT,
    "description" TEXT,
    "insights" TEXT,
    "link" TEXT,
    "applyLink" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applyBy" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scraped_jobs_expiresAt_idx" ON "scraped_jobs"("expiresAt");

-- CreateIndex
CREATE INDEX "blacklisted_tokens_expiresAt_idx" ON "blacklisted_tokens"("expiresAt");
