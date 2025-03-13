// User Routes //
import { Router } from "express";
import {
  signInUser,
  signUpUser,
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
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
  .get(authMiddleware, getUser)
  .put(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser);

// Export the router
export default userRouter;
