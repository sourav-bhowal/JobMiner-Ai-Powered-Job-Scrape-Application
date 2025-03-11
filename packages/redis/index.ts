import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// Create a new Redis instance
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});
