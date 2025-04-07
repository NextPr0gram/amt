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
modulesRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    createModuleHandler,
);
modulesRouter.patch(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    updateModuleHandler,
);
modulesRouter.get(
    "/module-tps",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.moduleTutor,
        userRoles.moduleTutor,
    ),
    getModuleTpsHandler,
);

export default modulesRouter;
