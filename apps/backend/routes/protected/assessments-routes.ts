import { Router } from "express";
import { getAssessmentsHandler } from "../../controllers/assessments-controller";

const assessmentsRouter = Router();

// Prefix: /assessments
assessmentsRouter.get("/", getAssessmentsHandler);

export default assessmentsRouter;
