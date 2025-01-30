import { Router } from "express";
import passport from "passport";
import { login, logout } from "./controllers/auth-controller";
// import controllers, example: import { dashboard } from "../controllers/protectedController";

const router = Router();

// Protected routes (authenticated via JWT in cookie)
router.get("/dashboard", passport.authenticate("jwt-cookiecombo", { session: false }), dashboard);

// Routes
router.post("/login", login);
router.post("/logout", logout);

export default router;
