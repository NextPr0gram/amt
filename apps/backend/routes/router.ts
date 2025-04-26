import { Router } from "express";
import authRouter from "./auth/auth-routes";
import userRouter from "./protected/user-routes";
import authenticate from "../middleware/authenticate";
import modulesRouter from "./protected/module-routes";
import usersRouter from "./protected/users-routes";
import yearsRouter from "./protected/years-routes";
import reviewGroupsRouter from "./protected/review-groups-routes";
import assessmentsRouter from "./protected/assessments-routes";
import moderationRouter from "./protected/moderation-routes";
import demoRouter from "./protected/demo-routes";
import boxRouter from "./protected/box-routes";
import { boxCallbackHandler } from "../controllers/box-controller";
import authorizeRouter from "./protected/authorize-page-routes";
import erRouter from "./protected/er-routes";
import AcademicYearAssessmentsRouter from "./protected/academic-year-assessments-routes";

const router = Router();

// Prefix: /
router.use("/auth", authRouter);
router.get("/box/callback", boxCallbackHandler);

// Protected routes
router.use("/user", authenticate, userRouter); // Current user
router.use("/users", authenticate, usersRouter); // All other users (module tutors, etc)
router.use("/modules", authenticate, modulesRouter);
router.use("/years", authenticate, yearsRouter);
router.use("/review-groups", authenticate, reviewGroupsRouter);
router.use("/assessments", authenticate, assessmentsRouter);
router.use("/academic-year-assessments", authenticate, AcademicYearAssessmentsRouter); // Academic year assessments
router.use("/moderation", authenticate, moderationRouter);
router.use("/box", authenticate, boxRouter);
router.use("/demo", authenticate, demoRouter);
router.use("/authorize-page", authenticate, authorizeRouter);
router.use("/er", authenticate, erRouter); // ER routes
export default router;
