import { Router } from "express";
import {
    createAssessmentHandler,
    getAssessmentCategoriesHandler,
    getAssessmentsHandler,
    getAssessmentTpsHandler,
    getAssessmentTypesHandler,
} from "../../controllers/assessments-controller";

const assessmentsRouter = Router();

// Prefix: /assessments
assessmentsRouter.get("/", getAssessmentsHandler);
assessmentsRouter.get("/types", getAssessmentTypesHandler);
assessmentsRouter.get("/categories", getAssessmentCategoriesHandler);
assessmentsRouter.post("/", createAssessmentHandler);
assessmentsRouter.get("/assessment-tps", getAssessmentTpsHandler);

export default assessmentsRouter;
