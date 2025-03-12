import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError";

// Middleware to check if the user is authenticated
export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Get the token from the request headers
  const token = request.headers.authorization?.split(" ")[1];

  // If the token is not provided, send a 401 response
  if (!token) {
    throw new apiError(401, "Unauthorized. Please provide a token");
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    // If token is invalid, send a 401 response
    if (!decodedToken) {
      throw new apiError(401, "Unauthorized. Invalid token");
    }

    // Attach the user to the request object
    request.user = decodedToken as CustomUser;

    // Call the next middleware
    next();
  } catch (error) {
    // If an error occurs, send a 401 response
    throw new apiError(401, "Something went wrong. Please try again");
  }
};
