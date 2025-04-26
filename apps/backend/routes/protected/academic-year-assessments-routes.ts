import { Router } from "express";
import { createAssessmentHandler, getAssessmentCategoriesHandler, getAssessmentsHandler, getAssessmentTypesHandler, getRemainingAssessmentWeightsHandler, updateAssessmentsHandler } from "../../controllers/assessments-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { getCurrentACYearExamsHandler, getCurrentACYearExamsTp1Handler, getCurrentACYearExamsTp2Handler } from "apps/backend/controllers/academic-year-assessments-controller";

const AcademicYearAssessmentsRouter = Router();

// Prefix: /academic-year-assessments
AcademicYearAssessmentsRouter.get("/current-ac-year-exams", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getCurrentACYearExamsHandler);
AcademicYearAssessmentsRouter.get("/current-ac-year-exams-tp1", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getCurrentACYearExamsTp1Handler);
AcademicYearAssessmentsRouter.get("/current-ac-year-exams-tp2", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getCurrentACYearExamsTp2Handler);

export default AcademicYearAssessmentsRouter;
