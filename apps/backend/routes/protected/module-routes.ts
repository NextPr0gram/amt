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
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    getModulesHandler,
);
modulesRouter.post(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    createModuleHandler,
);
modulesRouter.patch(
    "/",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    updateModuleHandler,
);
modulesRouter.get(
    "/module-tps",
    authorizeRoles(
        userRoles.assessmentLead,
        userRoles.dev,
        userRoles.moduleTutor,
        userRoles.moduleTutor,
    ),
    getModuleTpsHandler,
);

export default modulesRouter;
