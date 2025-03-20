import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import prisma from "@repo/database/prisma";
import asyncHandler from "../utils/asyncHandler.js";

// Middleware to check if the user is authenticated
export const authMiddleware = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    // Get the token from the request headers
    const token =
      request.headers.authorization?.split(" ")[1] ||
      request.cookies.accessToken;

    // If the token is not provided, send a 401 response
    if (!token) {
      throw new apiError(401, "Unauthorized. Please provide a token");
    }

    // Check if the token is blacklisted in the database
    const isTokenBlacklisted = await prisma.blacklistedToken.findFirst({
      where: {
        token,
      },
    });

    // If token is blacklisted, send a 401 response
    if (isTokenBlacklisted) {
      throw new apiError(401, "Unauthorized. Token is blacklisted");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ["HS256"],
    });

    // If token is invalid, send a 401 response
    if (!decodedToken) {
      throw new apiError(401, "Unauthorized. Invalid token");
    }

    // Attach the user to the request object
    request.user = decodedToken as CustomUser;

    // Call the next middleware
    next();
  }
);
