import {
    boxConnectHandler,
    checkBoxConnectedHandler,
} from "apps/backend/controllers/box-controller";
import { Router } from "express";
const boxRouter = Router();

// Prefix: /box
boxRouter.get("/connect", boxConnectHandler);
boxRouter.get("/check-box-connection", checkBoxConnectedHandler);

export default boxRouter;
