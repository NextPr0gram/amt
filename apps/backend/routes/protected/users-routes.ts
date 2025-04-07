import { getModuleTutorsHandler } from "apps/backend/controllers/users-controller";
import { authorizeRoles, userRoles } from "apps/backend/middleware/authorize";
import { Router } from "express";

const usersRouter = Router();

// Prefix: /users
usersRouter.get(
    "/",
    authorizeRoles(userRoles.assessmentLead),
    getModuleTutorsHandler,
);

export default usersRouter;
