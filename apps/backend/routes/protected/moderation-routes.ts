import { Router } from "express";
import {
    getModerationStatusHandler,
    getTpsHandler,
} from "../../controllers/moderation-controller";

const moderationRouter = Router();

// Prefix: /moderation
moderationRouter.get("/status", getModerationStatusHandler);
moderationRouter.get("/tps", getTpsHandler);

export default moderationRouter;
