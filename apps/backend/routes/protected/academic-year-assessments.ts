import { Router } from "express";
import { createAssessmentHandler, getAssessmentCategoriesHandler, getAssessmentsHandler, getAssessmentTypesHandler, getRemainingAssessmentWeightsHandler, updateAssessmentsHandler } from "../../controllers/assessments-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { getCurrentACYearExams } from "apps/backend/controllers/academic-year-assessments-controller";

const AcademicYearAssessmentsRouter = Router();

// Prefix: /academic-year-assessments
AcademicYearAssessmentsRouter.get("/current-ac-year-exams", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getCurrentACYearExams);

export default AcademicYearAssessmentsRouter;
