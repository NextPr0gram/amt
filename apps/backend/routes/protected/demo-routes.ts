import {
    createBoxFoldersHandler,
    nextPhaseHandler,
    prevPhaseHandler,
} from "apps/backend/controllers/demo-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";
const demoRouter = Router();

// Prefix: /demo
demoRouter.post(
    "/prev-phase",
    authorizeRoles(userRoles.assessmentLead),
    prevPhaseHandler,
);
demoRouter.post(
    "/next-phase",
    authorizeRoles(userRoles.assessmentLead),
    nextPhaseHandler,
);
demoRouter.post(
    "/create-box-folders",
    authorizeRoles(userRoles.assessmentLead),
    createBoxFoldersHandler,
);

export default demoRouter;
