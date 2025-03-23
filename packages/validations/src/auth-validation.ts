import { z } from "zod";

// SignUp validation schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .trim(),
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .trim(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(20, "First name must be at most 20 characters long")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(20, "Last name must be at most 20 characters long")
    .trim(),
});

// Type of SignUp schema
export type SignUpSchema = z.infer<typeof signUpSchema>;

// SignIn validation schema
export const signInSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .trim(),
});

// Type of SignIn schema
export type SignInSchema = z.infer<typeof signInSchema>;
