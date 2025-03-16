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