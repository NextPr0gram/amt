import { getUserHandler, getUserNotifications } from "apps/backend/controllers/user-controller";
import { Router } from "express";

const userRouter = Router();

// Prefix: /user
userRouter.get("/", getUserHandler);
userRouter.get("/notifications", getUserNotifications);

export default userRouter;
