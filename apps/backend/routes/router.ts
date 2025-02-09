import { Router } from "express";
import authRouter from "./auth/auth-routes";

const router = Router();

// prefix: /
router.use("/auth", authRouter);

export default router;
