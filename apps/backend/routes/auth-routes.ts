import { Router } from "express";
import { registerHandler, loginHandler, logoutHandler, refreshHandler } from "../controllers/auth-controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);

export default authRoutes;
