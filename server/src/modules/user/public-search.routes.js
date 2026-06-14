import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { default as PlayerModel } from "../player/player.model.js";
import { default as TeamModel } from "../team/team.model.js";
import { default as SeriesModel } from "../series/series.model.js";

/**
 * Escape regex special characters
 */
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * GET /api/search
 * Cross-entity search across players, teams, and series
 * Query params:
 *   - q: search query (min 2 chars)
 *   - type: 'player' | 'team' | 'series' (optional, search all if not specified)
 * Cache: 30 seconds
 */
export const search = asyncHandler(async (req, res) => {
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
            .select('firstName lastName fullName profileImage role country')
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
            .select('name shortName logo city')
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
            .select('name shortName description status format')
            .limit(limit)
            .lean();
    }

    res.status(200).json(
        new ApiResponse(200, {
            query: q,
            results: type ? results[type === "player" ? "players" : type === "team" ? "teams" : "series"] : results,
        }, "Search results retrieved successfully")
    );
});
