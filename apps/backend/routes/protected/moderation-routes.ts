import { Router } from "express";
import {
    getModerationStatusHandler,
    getTpsHandler,
} from "../../controllers/moderation-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const moderationRouter = Router();

// Prefix: /moderation
moderationRouter.get(
    "/status",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.moduleLead,
        userRoles.moduleTutor,
    ),
    getModerationStatusHandler,
);
moderationRouter.get(
    "/tps",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.moduleLead,
        userRoles.moduleTutor,
    ),
    getTpsHandler,
);

export default moderationRouter;
