import {
    getReviewGroupHandler,
    getUserHandler,
    getUserNotifications,
    getUserRoles,
} from "apps/backend/controllers/user-controller";
import { Router } from "express";

const userRouter = Router();

// Prefix: /user
userRouter.get("/", getUserHandler);
userRouter.get("/notifications", getUserNotifications);
userRouter.get("/user-roles", getUserRoles);
userRouter.get("/review-group", getReviewGroupHandler);

export default userRouter;
