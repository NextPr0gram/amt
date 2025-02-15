import { Router } from "express";
import authRouter from "./auth/auth-routes";
import userRouter from "./protected/user/user-routes";
import authenticate from "../middleware/authenticate";

const router = Router();

// Prefix: /
router.use("/auth", authRouter);

// Protected routes
router.use("/user", authenticate, userRouter);
router.use("/modules", authenticate, userRouter);
export default router;
