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
    authorizeRoles(userRoles.assessmentLead),
    getAssessmentsHandler,
);
assessmentsRouter.patch(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    updateAssessmentsHandler,
);
assessmentsRouter.get(
    "/types",
    authorizeRoles(userRoles.assessmentLead),
    getAssessmentTypesHandler,
);
assessmentsRouter.get(
    "/categories",
    authorizeRoles(userRoles.assessmentLead),
    getAssessmentCategoriesHandler,
);
assessmentsRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    createAssessmentHandler,
);

export default assessmentsRouter;
