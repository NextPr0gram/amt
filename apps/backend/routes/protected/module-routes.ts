import { getModulesHandler, createModuleHandler } from "apps/backend/controllers/module-controller";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get("/", getModulesHandler);
modulesRouter.post("/create-module", createModuleHandler);

export default modulesRouter;
