import { Router } from "express";
import { registerHandler, loginHandler, LogoutHandler } from "../controllers/auth-controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/logout", logoutHandler);

export default authRoutes;
