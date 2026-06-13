import express from "express";
import env from "./config/env.js";
import morgan from "morgan";
import SecurityMiddleware from "./middleware/security.middleware.js";
import googleOAuthMiddleware from "./middleware/googleOAuth.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import commentaryRouter from "./modules/commentary/commentary.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


function createApp() {
    const app = express();

    SecurityMiddleware(app)

    googleOAuthMiddleware(app);

    if (env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    app.get("/health", (req, res) => {
        res.status(200).json({ message: "OK" });
    })

    app.use("/api/auth", authRouter);
    app.use("/api/commentary", commentaryRouter);

    app.use(errorHandler);

    return app;
}

export default createApp;
