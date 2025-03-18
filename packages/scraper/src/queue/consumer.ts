import { insertJobInDB } from "../lib/insertJobInDB.js";
import { QUEUE_NAME } from "./producer.js";
import { connectRabbitMQ } from "@repo/rabbitmq";

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
