import { add10DaysHandler, add1DayHandler, add5DaysHandler, createBoxFoldersHandler, getCurrentDateHandler, nextPhaseHandler, prevPhaseHandler, subtract10DaysHandler, subtract1DayHandler, subtract5DaysHandler, unfinalizeReviewGroupsHandler } from "apps/backend/controllers/demo-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";
const demoRouter = Router();

// Prefix: /demo
demoRouter.post("/prev-phase", authorizeRoles(userRoles.assessmentLead, userRoles.dev), prevPhaseHandler);
demoRouter.post("/next-phase", authorizeRoles(userRoles.assessmentLead, userRoles.dev), nextPhaseHandler);
demoRouter.post("/create-box-folders", authorizeRoles(userRoles.assessmentLead, userRoles.dev), createBoxFoldersHandler);
demoRouter.post("/unfinalize-review-groups", authorizeRoles(userRoles.assessmentLead, userRoles.dev), unfinalizeReviewGroupsHandler);
demoRouter.get("/get-date", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), getCurrentDateHandler);
demoRouter.post("/add-1-day", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add1DayHandler);
demoRouter.post("/add-5-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add5DaysHandler);
demoRouter.post("/add-10-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add10DaysHandler);
demoRouter.post("/subtract-1-day", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract1DayHandler);
demoRouter.post("/subtract-5-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract5DaysHandler);
demoRouter.post("/subtract-10-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract10DaysHandler);

export default demoRouter;
