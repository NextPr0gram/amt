import { Router } from "express";
import {
    createAssessmentHandler,
    getAssessmentCategoriesHandler,
    getAssessmentsHandler,
    getAssessmentTypesHandler,
    updateAssessmentsHandler,
} from "../../controllers/assessments-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";

const assessmentsRouter = Router();

// Prefix: /assessments
assessmentsRouter.get(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    getAssessmentsHandler,
);
assessmentsRouter.patch(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    updateAssessmentsHandler,
);
assessmentsRouter.get(
    "/types",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    getAssessmentTypesHandler,
);
assessmentsRouter.get(
    "/categories",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    getAssessmentCategoriesHandler,
);
assessmentsRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    createAssessmentHandler,
);

export default assessmentsRouter;
