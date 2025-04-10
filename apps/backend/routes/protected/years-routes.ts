import { Router } from "express";
import { getYearsHandler } from "../../controllers/years-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const yearsRouter = Router();

// Prefix: /years
yearsRouter.get(
    "/",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.dev,
        userRoles.moduleTutor,
        userRoles.moduleLead,
    ),
    getYearsHandler,
);

export default yearsRouter;
