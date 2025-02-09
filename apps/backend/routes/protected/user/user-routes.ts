import { getUserHandler } from "apps/backend/controllers/user-controller";
import { Router } from "express";

const userRouter = Router();

// Prefix: /user
userRouter.post("/", getUserHandler);

export default userRouter;
