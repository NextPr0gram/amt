import { Router } from "express";
import { getModerationStatusHandler } from "../../controllers/moderation-controller";

const moderationRouter = Router();

// Prefix: /moderation
moderationRouter.get("/status", getModerationStatusHandler);

export default moderationRouter;
