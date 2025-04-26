import { Router } from "express";
import { getIsTp1DeadlinesSetHandler, getIsTp2DeadlinesSetHandler, getModerationStatusHandler, getTpsHandler, setIsTp1DeadlinesSetHandler, setIsTp2DeadlinesSetHandler, updateExternalModerationDeadlineTp1Handler, updateExternalModerationDeadlineTp2Handler, updateFinalDeadlineTp1Handler, updateFinalDeadlineTp2Handler, updateInternalModerationDeadlineTp1Handler, updateInternalModerationDeadlineTp2Handler } from "../../controllers/moderation-controller";
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
moderationRouter.get("/deadlines/tp1-deadlines-set", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getIsTp1DeadlinesSetHandler);
moderationRouter.get("/deadlines/tp2-deadlines-set", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getIsTp2DeadlinesSetHandler);
moderationRouter.post("/deadlines/tp1-deadlines-set", authorizeRoles(userRoles.assessmentLead, userRoles.dev), setIsTp1DeadlinesSetHandler);
moderationRouter.post("/deadlines/tp2-deadlines-set", authorizeRoles(userRoles.assessmentLead, userRoles.dev), setIsTp2DeadlinesSetHandler);

export default moderationRouter;
