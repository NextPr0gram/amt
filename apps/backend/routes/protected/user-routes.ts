import { getIsBoxConnected, getReviewGroupHandler, getUserAssessmentsForCurrentAcademicYearHandler, getUserAssessmentsToModerateHandler, getUserHandler, getUserNotifications, getUserRoles } from "apps/backend/controllers/user-controller";
import { Router } from "express";

const userRouter = Router();

// Prefix: /user
userRouter.get("/", getUserHandler);
userRouter.get("/notifications", getUserNotifications);
userRouter.get("/user-roles", getUserRoles);
userRouter.get("/review-group", getReviewGroupHandler);
userRouter.get("/assessments", getUserAssessmentsForCurrentAcademicYearHandler);
userRouter.get("/is-box-connected", getIsBoxConnected);
userRouter.get("/assessments-to-moderate", getUserAssessmentsToModerateHandler);

export default userRouter;
