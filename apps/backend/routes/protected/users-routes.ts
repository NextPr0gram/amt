import { getModuleTutorsHandler, sendNotificationsToUsersHandler } from "apps/backend/controllers/users-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";

const usersRouter = Router();

// Prefix: /users
usersRouter.get("/", authorizeRoles(userRoles.assessmentLead, userRoles.dev), getModuleTutorsHandler);
usersRouter.post("/notigy", sendNotificationsToUsersHandler);

export default usersRouter;
