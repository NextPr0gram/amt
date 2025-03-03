import { Router } from "express";
import { getAssessmentCategoriesHandler, getAssessmentsHandler, getAssessmentTypesHandler } from "../../controllers/assessments-controller";

const assessmentsRouter = Router();

// Prefix: /assessments
assessmentsRouter.get("/", getAssessmentsHandler);
assessmentsRouter.get("/types", getAssessmentTypesHandler);
assessmentsRouter.get("/categories", getAssessmentCategoriesHandler);

export default assessmentsRouter;
