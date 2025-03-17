import { boxConnectHandler } from "apps/backend/controllers/box-controller";
import { Router } from "express";
const boxRouter = Router();

// Prefix: /box
boxRouter.get("/connect", boxConnectHandler);

export default boxRouter;
