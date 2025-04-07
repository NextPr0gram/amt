import { Router } from "express";
import {
    createReviewGroupHandler,
    getReviewGroupsHandler,
} from "../../controllers/review-groups-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const reviewGroupsRouter = Router();

// Prefix: /reviewGroups
reviewGroupsRouter.get(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.moduleTutor),
    getReviewGroupsHandler,
);
reviewGroupsRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    createReviewGroupHandler,
);

export default reviewGroupsRouter;
