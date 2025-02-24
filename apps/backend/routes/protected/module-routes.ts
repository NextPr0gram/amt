import { getModulesHandler, createModuleHandler, updateModuleHandler } from "apps/backend/controllers/module-controller";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get("/", getModulesHandler);
modulesRouter.post("/", createModuleHandler);
modulesRouter.patch("/", updateModuleHandler);

export default modulesRouter;
