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
    authorizeRoles(userRoles.moduleTutor),
    getAssessmentsHandler,
);
assessmentsRouter.patch("/", updateAssessmentsHandler);
assessmentsRouter.get("/types", getAssessmentTypesHandler);
assessmentsRouter.get("/categories", getAssessmentCategoriesHandler);
assessmentsRouter.post("/", createAssessmentHandler);

export default assessmentsRouter;
