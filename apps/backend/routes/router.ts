import { Router } from "express";
import authRouter from "./auth/auth-routes";
import userRouter from "./protected/user-routes";
import authenticate from "../middleware/authenticate";
import modulesRouter from "./protected/module-routes";
import usersRouter from "./protected/users-routes";
import yearsRouter from "./protected/years-routes";
import reviewGroupsRouter from "./protected/review-groups-routes";
import assessmentsRouter from "./protected/assessments-routes";

const router = Router();

// Prefix: /
router.use("/auth", authRouter);

// Protected routes
router.use("/user", authenticate, userRouter); // Current user
router.use("/users", authenticate, usersRouter); // All other users (module tutors, etc)
router.use("/modules", authenticate, modulesRouter);
router.use("/years", authenticate, yearsRouter);
router.use("/review-groups", authenticate, reviewGroupsRouter);
router.use("/assessments", authenticate, assessmentsRouter);
export default router;
