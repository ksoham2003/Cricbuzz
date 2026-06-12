import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "../config/env.js";
import express from "express";

export default function SecurityMiddleware(app) {
    app.use(express.json({ limit: "10kb" }));
    app.use(express.urlencoded({ limit: "10kb", extended: true }));
    app.use(helmet());
    app.use(hpp());
    app.use(compression());
    app.use(cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(rateLimit({
        windowMs: env.RATELIMIT_WINDOWMS,
        max: env.RATELIMIT,
        message: `Too many requests from this IP, please try again after ${env.RATELIMIT_WINDOWMS / 60000} minutes`
    }));
}
    
