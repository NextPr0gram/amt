import { Router } from "express";
import { createReviewGroupHandler, getReviewGroupsHandler } from "../../controllers/review-groups-controller";

const reviewGroupsRouter = Router();

// Prefix: /reviewGroups
reviewGroupsRouter.get("/", getReviewGroupsHandler);
reviewGroupsRouter.post("/", createReviewGroupHandler);

export default reviewGroupsRouter;
