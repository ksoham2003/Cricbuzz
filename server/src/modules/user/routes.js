import express from "express";
import homeRouter from "./home/routes.js";
import matchRouter from "./match/routes.js";
import seriesRouter from "./series/routes.js";
import teamRouter from "./team/routes.js";
import playerRouter from "./player/routes.js";
import searchRouter from "./search/routes.js";
import commentaryRouter from "./commentary/routes.js";
import pointsTableRouter from "./points-table/routes.js";

const router = express.Router();

/**
 * PUBLIC API ROUTES
 * No authentication required
 * All GET requests are cached with configurable TTL
 */

// Home feed
router.use("/home", homeRouter);

// Match endpoints
router.use("/matches", matchRouter);
router.use("/matches/:matchId/commentary", commentaryRouter);

// Series endpoints
router.use("/series", seriesRouter);
router.use("/series/:seriesId/points-table", pointsTableRouter);

// Team endpoints
router.use("/teams", teamRouter);

// Player endpoints
router.use("/players", playerRouter);

// Search
router.use("/search", searchRouter);

export default router;
