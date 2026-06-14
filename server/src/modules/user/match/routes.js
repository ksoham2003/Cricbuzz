import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { ApiError } from "../../../utils/ApiError.js";

/**
 * Placeholder: Match model not yet fully implemented
 * These endpoints are stubs for the public API structure
 */

/**
 * GET /api/matches
 * Get paginated list of all matches
 */
const getAllMatches = asyncHandler(async (req, res) => {
    const { page, limit, skip } = pagination(req.query);
    const { series, status } = req.query;

    // Filter placeholder
    const filter = { isDeleted: false };
    if (series) filter.seriesId = series;
    if (status) filter.status = status;

    // Placeholder: Awaiting Match model implementation
    const matches = [];
    const total = 0;

    res.status(200).json(
        respondPaginated(matches, paginationMeta(page, limit, total), "Matches retrieved successfully")
    );
});

/**
 * GET /api/matches/:id
 * Get single match details
 */
const getMatchById = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    // Placeholder: Awaiting Match model implementation
    throw new ApiError(404, "Match not found");
});

/**
 * GET /api/matches/:id/scorecard
 * Get match scorecard (teams, players, scores)
 */
const getMatchScorecard = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    // Placeholder: Awaiting Score module implementation
    const scorecard = {
        matchId,
        team1: { name: "", score: 0, wickets: 0 },
        team2: { name: "", score: 0, wickets: 0 },
        players: [],
    };

    res.status(200).json(
        respondSuccess(scorecard, "Match scorecard retrieved successfully")
    );
});

/**
 * GET /api/matches/:id/center
 * Get match center (live updates)
 */
const getMatchCenter = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    // Placeholder: Awaiting real-time implementation
    const center = {
        matchId,
        status: "not_started",
        current: {},
    };

    res.status(200).json(
        respondSuccess(center, "Match center retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(10), getAllMatches);
router.get("/:id", responseCache(10), getMatchById);
router.get("/:id/scorecard", responseCache(10), getMatchScorecard);
router.get("/:id/center", responseCache(5), getMatchCenter);

export default router;
