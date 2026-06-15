import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import Match from "../../match/match.model.js";

/**
 * GET /api/home
 * Returns home page data with featured content: live, upcoming, and recent matches.
 */
const getHome = asyncHandler(async (req, res) => {
    const [liveMatches, upcomingMatches, recentMatches] = await Promise.all([
        // 1. Live & Innings Break matches
        Match.find({
            status: { $in: ["LIVE", "INNINGS_BREAK"] },
            isDeleted: false,
        })
            .populate("seriesId", "name shortName logo status format")
            .populate("team1", "name shortName logo primaryColor")
            .populate("team2", "name shortName logo primaryColor")
            .sort({ startTime: -1 })
            .limit(10)
            .lean(),

        // 2. Upcoming matches (UPCOMING, TOSS_COMPLETED, PLAYING_XI_SELECTED)
        Match.find({
            status: { $in: ["UPCOMING", "TOSS_COMPLETED", "PLAYING_XI_SELECTED"] },
            isDeleted: false,
        })
            .populate("seriesId", "name shortName logo status format")
            .populate("team1", "name shortName logo primaryColor")
            .populate("team2", "name shortName logo primaryColor")
            .sort({ startTime: 1 })
            .limit(10)
            .lean(),

        // 3. Completed matches
        Match.find({
            status: "COMPLETED",
            isDeleted: false,
        })
            .populate("seriesId", "name shortName logo status format")
            .populate("team1", "name shortName logo primaryColor")
            .populate("team2", "name shortName logo primaryColor")
            .populate("winner", "name shortName logo")
            .sort({ startTime: -1 })
            .limit(10)
            .lean(),
    ]);

    res.status(200).json(
        respondSuccess({
            liveMatches,
            upcomingMatches,
            recentMatches,
        }, "Home data retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(10), getHome);

export default router;
