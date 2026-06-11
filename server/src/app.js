import express from "express";
import env from "./config/env.js";
import logger from "./config/logger.js";
import morgan from "morgan";


function createApp() {
    const app = express();

    if (env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    app.get("/health", (req, res) => {
        res.status(200).json({ message: "OK" });
    })

    return app;
}

export default createApp;