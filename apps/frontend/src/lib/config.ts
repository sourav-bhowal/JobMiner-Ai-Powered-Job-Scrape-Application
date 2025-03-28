import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});

export const config = {
  NEXT_PUBLIC_HTTP_BACKEND_URL: process.env.NEXT_PUBLIC_HTTP_BACKEND_URL,
  HTTP_BACKEND_URL: process.env.HTTP_BACKEND_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
};
