import {
    getModulesHandler,
    createModuleHandler,
    updateModuleHandler,
    getModuleTpsHandler,
} from "apps/backend/controllers/module-controller";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get("/", getModulesHandler);
modulesRouter.post("/", createModuleHandler);
modulesRouter.patch("/", updateModuleHandler);
modulesRouter.get("/module-tps", getModuleTpsHandler);

export default modulesRouter;
