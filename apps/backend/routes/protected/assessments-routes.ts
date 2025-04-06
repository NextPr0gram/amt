import { Router } from "express";
import {
    createAssessmentHandler,
    getAssessmentCategoriesHandler,
    getAssessmentsHandler,
    getAssessmentTypesHandler,
    updateAssessmentsHandler,
} from "../../controllers/assessments-controller";

const assessmentsRouter = Router();

// Prefix: /assessments
assessmentsRouter.get("/", getAssessmentsHandler);
assessmentsRouter.patch("/", updateAssessmentsHandler);
assessmentsRouter.get("/types", getAssessmentTypesHandler);
assessmentsRouter.get("/categories", getAssessmentCategoriesHandler);
assessmentsRouter.post("/", createAssessmentHandler);

export default assessmentsRouter;
