import { Router } from "express";
import { login, logout, register } from "../controllers/auth-controller";

const router = Router();

// Protected routes (authenticated via JWT in cookie)
//router.get("/dashboard", passport.authenticate("jwt-cookiecombo", { session: false }), dashboard);

// Routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

export default router;
