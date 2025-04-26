import { getIsBoxConnected, getReviewGroupHandler, getUserAssessmentsForCurrentAcademicYearTp1Handler, getUserAssessmentsToModerateTp1Handler, getUserAssessmentsForCurrentAcademicYearTp2Handler, getUserAssessmentsToModerateTp2Handler, getUserHandler, getUserNotifications, getUserRoles } from "apps/backend/controllers/user-controller";
import { Router } from "express";

const userRouter = Router();

// Prefix: /user
userRouter.get("/", getUserHandler);
userRouter.get("/notifications", getUserNotifications);
userRouter.get("/user-roles", getUserRoles);
userRouter.get("/review-group", getReviewGroupHandler);
userRouter.get("/is-box-connected", getIsBoxConnected);
userRouter.get("/assessments-tp1", getUserAssessmentsForCurrentAcademicYearTp1Handler);
userRouter.get("/assessments-to-moderate-tp1", getUserAssessmentsToModerateTp1Handler);
userRouter.get("/assessments-tp2", getUserAssessmentsForCurrentAcademicYearTp2Handler);
userRouter.get("/assessments-to-moderate-tp2", getUserAssessmentsToModerateTp2Handler);

export default userRouter;
