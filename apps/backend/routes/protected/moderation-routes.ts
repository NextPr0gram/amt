import { Router } from "express";
import {
    getModerationStatusHandler,
    getTpsHandler,
    updateExternalModerationDeadlineHandler,
    updateFinalDeadlineHandler,
    updateInternalModerationDeadlineHandler,
} from "../../controllers/moderation-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const moderationRouter = Router();

// Prefix: /moderation
moderationRouter.get(
    "/status",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.dev,
        userRoles.moduleLead,
        userRoles.moduleTutor,
    ),
    getModerationStatusHandler,
);
moderationRouter.get(
    "/tps",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.dev,
        userRoles.moduleLead,
        userRoles.moduleTutor,
    ),
    getTpsHandler,
);

moderationRouter.patch(
    "/deadlines/internal",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    updateInternalModerationDeadlineHandler,
);

moderationRouter.patch(
    "/deadlines/external",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    updateExternalModerationDeadlineHandler,
);

moderationRouter.patch(
    "/deadlines/final",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    updateFinalDeadlineHandler,
);

export default moderationRouter;
