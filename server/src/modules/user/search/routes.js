import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { escapeRegex } from "../shared/query.js";
import { ApiError } from "../../../utils/ApiError.js";
import { default as PlayerModel } from "../../player/player.model.js";
import { default as TeamModel } from "../../team/team.model.js";
import { default as SeriesModel } from "../../series/series.model.js";

/**
 * GET /api/search
 * Cross-entity search across players, teams, and series
 * Query params:
 *   - q: search query (min 2 chars, required)
 *   - type: 'player' | 'team' | 'series' (optional, searches all if not specified)
 */
const search = asyncHandler(async (req, res) => {
    const { q, type } = req.query;

    // Validate search query
    if (!q || q.trim().length < 2) {
        throw new ApiError(400, "Search query must be at least 2 characters");
    }

    const query = escapeRegex(q.trim());
    const regex = new RegExp(query, "i");
    const limit = 10;

    const results = {
        players: [],
        teams: [],
        series: [],
    };

    // Search players
    if (!type || type === "player") {
        results.players = await PlayerModel.find({
            isDeleted: false,
            $or: [
                { fullName: regex },
                { firstName: regex },
                { lastName: regex },
                { country: regex },
            ],
        })
            .select("firstName lastName fullName profileImage role country")
            .limit(limit)
            .lean();
    }

    // Search teams
    if (!type || type === "team") {
        results.teams = await TeamModel.find({
            isDeleted: false,
            $or: [
                { name: regex },
                { shortName: regex },
                { city: regex },
            ],
        })
            .select("name shortName logo city")
            .limit(limit)
            .lean();
    }

    // Search series
    if (!type || type === "series") {
        results.series = await SeriesModel.find({
            isDeleted: false,
            $or: [
                { name: regex },
                { shortName: regex },
                { description: regex },
            ],
        })
            .select("name shortName description status format")
            .limit(limit)
            .lean();
    }

    const response = type
        ? results[type === "player" ? "players" : type === "team" ? "teams" : "series"]
        : results;

    res.status(200).json(
        respondSuccess({
            query: q,
            type: type || "all",
            results: response,
        }, "Search results retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(30), search);

export default router;
