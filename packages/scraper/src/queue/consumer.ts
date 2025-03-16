import prisma from "@repo/database/prisma";
import { QUEUE_NAME } from "./producer.js";
import { connectRabbitMQ } from "@repo/rabbitmq";
import { Job } from "../types/job-type.js";

// Process Jobs from RabbitMQ and save them to the database
async function insertJobInDB(jobBatch: Job[]) {
  try {
    // If the jobBatch is empty, return
    if (jobBatch.length === 0 || !jobBatch) {
      console.log("No job to insert in DB");
      return;
    }
    // Insert the job in the database
    await prisma.scrapedJob.createMany({
      data: jobBatch,
      skipDuplicates: true,
    });
    console.log("Job inserted in DB");
  } catch (error) {
    console.error("Error inserting job in DB", error);
  }
}

// Connect to RabbitMQ and consume jobs
export const consumeJobsFromQueue = async () => {
  // Get the channel and connection
  const { channel, connection } = await connectRabbitMQ();

  // Assert the queue
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("Waiting for jobs...");

  // Consume jobs from the queue
  channel.consume(
    QUEUE_NAME,
    async (message) => {
      if (message) {
        try {
          // Parse the job batch
          const jobBatch = JSON.parse(message.content.toString());
          console.log("Received job");
          // Insert the job in the database
          await insertJobInDB(jobBatch);
          // Acknowledge the message
          channel.ack(message);
        } catch (error) {
          console.error("Error processing job", error);
          // Requeue the message if there is an error
          channel.nack(message, false, false);
        }
      }
    },
    { noAck: false } // Make sure the message is not lost if the consumer crashes
  );
};
