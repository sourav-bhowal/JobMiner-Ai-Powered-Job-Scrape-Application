import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";
import { startBlacklistTokenCleanup } from "./src/utils/cronJob.js";

// Create a new express application
const app: Application = express();

// Cron Jobs
if (process.env.NODE_ENV === "production") {
  // Start the cron job to cleanup the blacklist tokens
  startBlacklistTokenCleanup();
}

// Port to listen on
const PORT = process.env.PORT;

// Add CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

// Add json body parser middleware
app.use(express.json({ limit: "50mb" }));

// Add urlencoded body parser middleware
app.use(express.urlencoded({ extended: true }));

// Add cookie parser middleware
app.use(cookieParser());

// Add the user router
app.use("/api/user", userRouter);

// Listen on the specified port
app.listen(PORT, () => {
  console.log("HTTP Server is running on port", PORT);
});
