import {
    boxConnectHandler,
    checkBoxConnectedHandler,
} from "apps/backend/controllers/box-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";
const boxRouter = Router();

// Prefix: /box
boxRouter.get(
    "/connect",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    boxConnectHandler,
);
boxRouter.get(
    "/check-box-connection",
    authorizeRoles(userRoles.assessmentLead, userRoles.dev),
    checkBoxConnectedHandler,
);

export default boxRouter;
