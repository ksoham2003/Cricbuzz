import express from "express";
import AuthController from "./auth.controller.js";
import passport from "passport";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Local Auth Endpoints
router.post("/register", (req, res, next) => AuthController.register(req, res, next));
router.post("/login", (req, res, next) => AuthController.login(req, res, next));

// Token Management Endpoints
router.post("/refresh", (req, res, next) => AuthController.refresh(req, res, next));
router.post("/logout", authenticate, (req, res, next) => AuthController.logout(req, res, next));

// Google OAuth Endpoints
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/error", session: false }),
    (req, res, next) => AuthController.googleAuth(req, res, next)
);

export default router;
