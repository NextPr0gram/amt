import { getModulesHandler, createModuleHandler } from "apps/backend/controllers/module-controller";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get("/", getModulesHandler);
modulesRouter.post("/", createModuleHandler);

export default modulesRouter;
