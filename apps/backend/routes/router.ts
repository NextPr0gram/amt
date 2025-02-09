import { Router } from "express";
import authRouter from "./auth/auth-routes";
import userRouter from "./protected/user/user-routes";
import authenticate from "../middleware/authenticate";

const router = Router();

// Prefix: /
router.use("/auth", authRouter);

// Protected routes
router.use(authenticate); // All routes below this line are protected and go through the authenticate middleware
router.use("/user", userRouter);

export default router;
