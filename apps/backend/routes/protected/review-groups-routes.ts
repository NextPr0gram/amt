import { Router } from "express";
import { getReviewGroupsHandler } from "../../controllers/review-groups-controller";

const reviewGroupsRouter = Router();

// Prefix: /reviewGroups
reviewGroupsRouter.get("/", getReviewGroupsHandler);

export default reviewGroupsRouter;
