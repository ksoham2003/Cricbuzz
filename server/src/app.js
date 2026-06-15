import express from "express";
import env from "./config/env.js";
import morgan from "morgan";
import SecurityMiddleware from "./middleware/security.middleware.js";
import googleOAuthMiddleware from "./middleware/googleOAuth.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import userAdminRouter from "./modules/users/user.routes.js";
import userPublicRouter from "./modules/user/routes.js";
import seriesRouter from "./modules/series/series.routes.js";
import commentaryRouter from "./modules/commentary/commentary.routes.js";
import teamRouter from "./modules/team/team.routes.js";
import playerRouter from "./modules/player/player.routes.js";
import squadRouter from "./modules/squad/squad.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


function createApp() {
    const app = express();

    SecurityMiddleware(app);

    googleOAuthMiddleware(app);

    if (env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    app.get("/health", (req, res) => {
        res.status(200).json({ message: "OK" });
    });

    app.use("/uploads", express.static("uploads"));

    app.use("/api/auth", authRouter);
    app.use("/api/users", userAdminRouter);
    app.use("/api/series", seriesRouter);
    app.use("/api/commentary", commentaryRouter);
    app.use("/api/teams", teamRouter);
    app.use("/api/players", playerRouter);
    app.use("/api/squads", squadRouter);
    app.use("/api", userPublicRouter);

    app.use(errorHandler);

    return app;
}

export default createApp;
