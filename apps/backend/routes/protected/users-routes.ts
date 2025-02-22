import { getModuleTutorsHandler } from "apps/backend/controllers/users-controller";
import { Router } from "express";

const usersRouter = Router();

// Prefix: /users
usersRouter.get("/", getModuleTutorsHandler);

export default usersRouter;
