import { nextPhaseHandler, prevPhaseHandler } from "apps/backend/controllers/demo-controller";
import { Router } from "express";
const demoRouter = Router();

// Prefix: /demo
demoRouter.post("/prev-phase", prevPhaseHandler);
demoRouter.post("/next-phase", nextPhaseHandler);

export default demoRouter;
