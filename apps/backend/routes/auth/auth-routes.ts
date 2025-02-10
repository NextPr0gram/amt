import { Router } from "express";
import { registerHandler, loginHandler, logoutHandler, refreshHandler, validateHandler } from "../../controllers/auth-controller";

const authRouter = Router();

// prefix: /auth
authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/refresh", refreshHandler);
authRouter.post("/validate", validateHandler);

export default authRouter;
