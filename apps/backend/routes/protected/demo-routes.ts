import { createBoxFoldersHandler, nextPhaseHandler, prevPhaseHandler, unfinalizeReviewGroupsHandler } from "apps/backend/controllers/demo-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";
const demoRouter = Router();

// Prefix: /demo
demoRouter.post("/prev-phase", authorizeRoles(userRoles.assessmentLead, userRoles.dev), prevPhaseHandler);
demoRouter.post("/next-phase", authorizeRoles(userRoles.assessmentLead, userRoles.dev), nextPhaseHandler);
demoRouter.post("/create-box-folders", authorizeRoles(userRoles.assessmentLead, userRoles.dev), createBoxFoldersHandler);
demoRouter.post("/unfinalize-review-groups", authorizeRoles(userRoles.assessmentLead, userRoles.dev), unfinalizeReviewGroupsHandler);

export default demoRouter;
