import { nextPhaseHandler } from "apps/backend/controllers/demo-controller";
import { demoRouter } from "./demo-routes";

demoRouter.post("/next-phase", nextPhaseHandler);

