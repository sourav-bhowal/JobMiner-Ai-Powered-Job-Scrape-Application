import prisma from "@repo/database/prisma";
import cron from "node-cron";

// Clean up old scraped jobs every month
export function startScrapedJobCleanup() {
    // Run every month
    cron.schedule("0 0 1 * *", async () => {
      await prisma.job.deleteMany({
        where: {
          createdAt: {
            lte: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Delete jobs created more than a month ago
          },
        },
      });
      console.log("Cleaned up old scraped jobs");
    });
  }