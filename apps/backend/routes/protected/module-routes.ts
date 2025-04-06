import {
    getModulesHandler,
    createModuleHandler,
    updateModuleHandler,
    getModuleTpsHandler,
} from "apps/backend/controllers/module-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";

const modulesRouter = Router();

// Prefix: /modules
modulesRouter.get(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    getModulesHandler,
);
modulesRouter.post("/", createModuleHandler);
modulesRouter.patch("/", updateModuleHandler);
modulesRouter.get("/module-tps", getModuleTpsHandler);

export default modulesRouter;
