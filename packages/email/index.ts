import { Resend } from "resend";
import { WelcomeEmailTemplate } from "./components/welcome-email-template.js";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables
const envPath = path.resolve(__dirname, ".env");

// Ensure the environment variables are loaded
dotenv.config({ path: envPath });

// Initailize the Resend email client
const resend = new Resend(process.env.RESEND_API_KEY!);

// Props for the welcome email
interface WelcomeEmailProps {
  email: string;
  username: string;
}

// Send an email to the user
export const sendWelcomeEmail = async ({
  email,
  username,
}: WelcomeEmailProps) => {
  // Send the email using the Resend client
  const { error, data } = await resend.emails.send({
    from: "Job-Finder <welcome@souravbhowal.site>",
    to: email,
    subject: "Welcome to Job Finder",
    react: await WelcomeEmailTemplate({ username }),
  });

  // Log the error if any
  if (error) {
    console.error(error);
  }

  // Return the data
  return data;
};
