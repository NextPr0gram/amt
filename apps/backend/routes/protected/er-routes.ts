import { Router } from "express";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { createErFolderHandler, getErFoldersHandler } from "apps/backend/controllers/er-controller";

const erRouter = Router();

// Prefix: /er
erRouter.get("/folders", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getErFoldersHandler);
erRouter.post("/folders", authorizeRoles(userRoles.assessmentLead, userRoles.dev), createErFolderHandler);

export default erRouter;
