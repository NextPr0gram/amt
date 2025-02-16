import { getModulesHandler } from "apps/backend/controllers/module-controller";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get("/", getModulesHandler);

export default modulesRouter;
