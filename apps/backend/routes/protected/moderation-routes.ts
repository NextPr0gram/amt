import { Router } from "express";
import { getModerationStatusHandler, getTpsHandler, updateExternalModerationDeadlineTp1Handler, updateExternalModerationDeadlineTp2Handler, updateFinalDeadlineTp1Handler, updateFinalDeadlineTp2Handler, updateInternalModerationDeadlineTp1Handler, updateInternalModerationDeadlineTp2Handler } from "../../controllers/moderation-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const moderationRouter = Router();

// Prefix: /moderation
moderationRouter.get("/status", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleLead, userRoles.moduleTutor), getModerationStatusHandler);
moderationRouter.get("/tps", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleLead, userRoles.moduleTutor), getTpsHandler);

moderationRouter.patch("/deadlines/internal-tp1", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateInternalModerationDeadlineTp1Handler);

moderationRouter.patch("/deadlines/external-tp1", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateExternalModerationDeadlineTp1Handler);

moderationRouter.patch("/deadlines/final-tp1", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateFinalDeadlineTp1Handler);

moderationRouter.patch("/deadlines/internal-tp2", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateInternalModerationDeadlineTp2Handler);

moderationRouter.patch("/deadlines/external-tp2", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateExternalModerationDeadlineTp2Handler);

moderationRouter.patch("/deadlines/final-tp2", authorizeRoles(userRoles.assessmentLead, userRoles.dev), updateFinalDeadlineTp2Handler);

export default moderationRouter;
