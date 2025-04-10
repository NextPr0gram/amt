import { Router } from "express";
import {
    createReviewGroupHandler,
    deleteReviewGroupHandler,
    finalizeReviewGroupsHandler,
    getIsFinalizedReviewGroupsHandler,
    getReviewGroupsHandler,
} from "../../controllers/review-groups-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const reviewGroupsRouter = Router();

// Prefix: /reviewGroups
reviewGroupsRouter.get(
    "/",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.dev,
        userRoles.moduleTutor,
    ),
    getReviewGroupsHandler,
);
reviewGroupsRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    createReviewGroupHandler,
);
reviewGroupsRouter.delete(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    deleteReviewGroupHandler,
);

reviewGroupsRouter.post(
    "/finalize",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    finalizeReviewGroupsHandler,
);

reviewGroupsRouter.get(
    "/get-finalize",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    getIsFinalizedReviewGroupsHandler,
);
export default reviewGroupsRouter;
