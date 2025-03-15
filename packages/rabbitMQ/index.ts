import amqp, { Channel, Connection } from "amqplib";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

// Connection and channel variables
let connection: Connection | null = null;
let channel: Channel | null = null;

// RabbitMQ connection string
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

// Connect to RabbitMQ
export default async function connectRabbitMQ(): Promise<{
  connection: Connection;
  channel: Channel;
}> {
  if (connection && channel) {
    return { connection, channel };
  }

  //TODO: FIX THE TYPE ISSUE
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    console.log("Connected to RabbitMQ");
    channel = await connection?.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ: ", error);
    throw error;
  }
}
