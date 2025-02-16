import { Router } from "express";
import authRouter from "./auth/auth-routes";
import userRouter from "./protected/user-routes";
import authenticate from "../middleware/authenticate";
import modulesRouter from "./protected/module-routes";

const router = Router();

// Prefix: /
router.use("/auth", authRouter);

// Protected routes
router.use("/user", authenticate, userRouter);
router.use("/modules", authenticate, modulesRouter);
export default router;
