import express from "express";
import { responseCache } from "../../middleware/cache.middleware.js";
import { getHome, getAllSeries, getSeriesById, getSeriesPointsTable } from "./public-series.routes.js";
import { getAllTeams, getTeamById } from "./public-teams.routes.js";
import { getAllPlayers, getPlayerById } from "./public-players.routes.js";
import { search } from "./public-search.routes.js";

const router = express.Router();

/**
 * PUBLIC API ROUTES - No authentication required
 * All GET requests are cached with TTL
 */

// Home Feed - 10 second cache
router.get("/home", responseCache(10), getHome);

// Series endpoints - 60 second cache
router.get("/series", responseCache(60), getAllSeries);
router.get("/series/:id", responseCache(60), getSeriesById);
router.get("/series/:id/points-table", responseCache(30), getSeriesPointsTable);

// Team endpoints - 60 second cache
router.get("/teams", responseCache(60), getAllTeams);
router.get("/teams/:id", responseCache(60), getTeamById);

// Player endpoints - 60 second cache
router.get("/players", responseCache(60), getAllPlayers);
router.get("/players/:id", responseCache(60), getPlayerById);

// Search endpoint - 30 second cache
router.get("/search", responseCache(30), search);

export default router;
