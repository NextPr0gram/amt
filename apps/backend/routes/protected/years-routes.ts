import { Router } from "express";
import { getYearsHandler } from "../../controllers/years-controller";

const yearsRouter = Router();

// Prefix: /years
yearsRouter.get("/", getYearsHandler);

export default yearsRouter;
