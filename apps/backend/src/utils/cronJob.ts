import prisma from "@repo/database/prisma";
import cron from "node-cron";

// Clean up expired blacklisted tokens every day
export function startBlacklistTokenCleanup() {
  // Run every day
  cron.schedule("0 0 * * *", async () => {
    await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(), // Delete tokens where expiration <= current time
        },
      },
    });
    console.log("Cleaned up expired blacklisted tokens");
  });
}

// Clean up old scraped jobs every month
export function startScrapedJobCleanup() {
  // Run every month
  cron.schedule("0 0 1 * *", async () => {
    await prisma.scrapedJob.deleteMany({
      where: {
        createdAt: {
          lte: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Delete jobs created more than a month ago
        },
      },
    });
    console.log("Cleaned up old scraped jobs");
  });
}
