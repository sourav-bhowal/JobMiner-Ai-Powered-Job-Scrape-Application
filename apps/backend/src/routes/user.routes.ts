// User Routes //
import { Router } from "express";
import {
  signInUser,
  signUpUser,
  updateUser,
  resetPassword,
  deleteUser,
  getUserProfile,
  updateUserJobPreferences,
  signOutUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Create a new router
const userRouter = Router();

// POST /api/user/signup
userRouter.post("/signup", signUpUser);

// POST /api/user/signin
userRouter.post("/signin", signInUser);

// POST /api/user/reset-password
userRouter.post("/reset-password", authMiddleware, resetPassword);

// GET, PUT, DELETE /api/user
userRouter
  .route("/")
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser);

// POST /api/user/update-job-preferences
userRouter.post(
  "/update-job-preferences",
  authMiddleware,
  updateUserJobPreferences
);

// POST /api/user/signout
userRouter.post("/signout", authMiddleware, signOutUser);

// Export the router
export default userRouter;
