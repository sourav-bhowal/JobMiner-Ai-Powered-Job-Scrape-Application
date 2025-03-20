import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});

export const config = {
  HTTP_BACKEND_URL: process.env.HTTP_BACKEND_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
};
