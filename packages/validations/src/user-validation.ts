import { z } from "zod";

// Reset password validation schema
export const resetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

// Type of Reset password schema
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

// Update user validation schema
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(20, "First name must be at most 20 characters long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(20, "Last name must be at most 20 characters long"),
  bio: z.string().max(100, "Bio must be at most 100 characters long"),
  city: z.string().max(50, "City must be at most 50 characters long"),
  state: z.string().max(50, "State must be at most 50 characters long"),
  country: z.string().max(50, "Country must be at most 50 characters long"),
  website: z.string().url("Invalid website URL"),
  resume: z.string().url("Invalid resume URL"),
  linkedIn: z.string().url("Invalid LinkedIn URL"),
  gitHub: z.string().url("Invalid GitHub URL"),
  twitter: z.string().url("Invalid Twitter URL"),
});

// Type of Update user schema
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;