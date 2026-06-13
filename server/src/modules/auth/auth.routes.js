import express from "express";
import AuthController from "./auth.controller.js";
import passport from "passport";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login/register requests per windowMs
    message: "Too many auth attempts from this IP, please try again after 15 minutes",
});

const router = express.Router();

// Local Auth Endpoints
router.post("/register", authLimiter, (req, res, next) => AuthController.register(req, res, next));
router.post("/login", authLimiter, (req, res, next) => AuthController.login(req, res, next));

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
