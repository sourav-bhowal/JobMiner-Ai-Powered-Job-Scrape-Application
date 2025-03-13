import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

// Get the OpenAI API key from the environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Create an instance of the OpenAI class
export const openai = new OpenAI({ apiKey });

