// User Controllers //
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiError";
import prisma from "@repo/database/prisma";
import { signInSchema, signUpSchema } from "@repo/validations/auth-validation";
import {
  resetPasswordSchema,
  updateUserSchema,
} from "@repo/validations/user-validation";

// Sign Up Controller
export const signUpUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    const { error, success, data } = signUpSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error.errors[0].message);
    }

    // Destructure request body
    const { username, email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // If user exists, throw an error
    if (existingUser) {
      throw new apiError(
        400,
        "User with this email or username already exists."
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // If user is not created, throw an error
    if (!newUser) {
      throw new apiError(400, "User could not be created.");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    // Send response
    response.status(201).json(
      new apiResponse(
        201,
        {
          accessToken: token,
        },
        "User created successfully."
      )
    );
  }
);

// Sign In Controller
export const signInUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Parse request body
    const { success, error, data } = signInSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error.errors[0].message);
    }

    // Destructure request body
    const { email, password } = data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new apiError(400, "Invalid credentials or user does not exist.");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, throw an error
    if (!isPasswordValid) {
      throw new apiError(400, "Invalid credentials.");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    // Send response
    response.status(200).json(
      new apiResponse(
        200,
        {
          accessToken: token,
        },
        "User signed in successfully."
      )
    );
  }
);

// Get User Controller
export const getUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Get user from request object
    const user = request.user;

    // Send response
    response
      .status(200)
      .json(new apiResponse(200, { user }, "User retrieved successfully."));
  }
);

// Reset Password Controller
export const resetPassword = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    const { error, success, data } = resetPasswordSchema.safeParse(
      request.body
    );

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error.errors[0].message);
    }

    // Destructure request body
    const { oldPassword, newPassword } = data;

    // Get user from Db
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new apiError(400, "User does not exist.");
    }

    // If logged in user is not the same as the user to be updated, throw an error
    if (user.id !== request.user.id) {
      throw new apiError(401, "Unauthorized. You are not allowed to do this.");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    // If password is invalid, throw an error
    if (!isPasswordValid) {
      throw new apiError(400, "Invalid old password.");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Send response
    response
      .status(200)
      .json(new apiResponse(200, null, "Password reset successfully."));
  }
);

// Update User Controller
export const updateUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    const { error, success, data } = updateUserSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error.errors[0].message);
    }

    // Deconstruct request body
    const {
      firstName,
      lastName,
      bio,
      city,
      state,
      country,
      website,
      resume,
      linkedIn,
      gitHub,
      twitter,
    } = data;

    // Get user from Db
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new apiError(400, "User does not exist.");
    }

    // If logged in user is not the same as the user to be updated, throw an error
    if (user.id !== request.user.id) {
      throw new apiError(401, "Unauthorized. You are not allowed to do this.");
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        bio,
        city,
        state,
        country,
        website,
        resume,
        linkedIn,
        gitHub,
        twitter,
      },
      select: {
        password: false,
      },
    });

    // If user is not updated, throw an error
    if (!updatedUser) {
      throw new apiError(400, "User could not be updated.");
    }

    // Send response
    response
      .status(200)
      .json(
        new apiResponse(
          200,
          { user: updatedUser },
          "User updated successfully."
        )
      );
  }
);

// Delete User Controller
export const deleteUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Get user from Db
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new apiError(400, "User does not exist.");
    }

    // If logged in user is not the same as the user to be updated, throw an error
    if (user.id !== request.user.id) {
      throw new apiError(401, "Unauthorized. You are not allowed to do this.");
    }

    // Delete user
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Send response
    response
      .status(200)
      .json(new apiResponse(200, null, "User deleted successfully."));
  }
);
