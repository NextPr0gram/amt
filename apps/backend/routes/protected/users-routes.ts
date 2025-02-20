import { getModuleTutorsHandler } from "apps/backend/controllers/users-controller";
import { Router } from "express";

const usersRouter = Router();

// Prefix: /users
usersRouter.get("/get-module-tutors", getModuleTutorsHandler);

export default usersRouter;
