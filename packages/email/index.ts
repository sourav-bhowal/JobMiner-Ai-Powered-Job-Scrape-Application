import { Resend } from "resend";
import { EmailTemplate } from "./components/welcome-email.js";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

// Initailize the Resend email client
const resend = new Resend(process.env.RESEND_API_KEY!);

// Send an email to the user
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const { error, data } = await resend.emails.send({
    from: "Job-Finder <welcome@souravbhowal.site>",
    to: email,
    subject: "Welcome to our app!",
    react: await EmailTemplate({ firstName }),
  });

  // Log the error if any
  if (error) {
    console.error(error);
  }

  // Return the data
  return data;
};
