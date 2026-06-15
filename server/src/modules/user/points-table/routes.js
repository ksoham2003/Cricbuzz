import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId } from "../shared/query.js";
import { ApiError } from "../../../utils/ApiError.js";
import Series from "../../series/series.model.js";
import Team from "../../team/team.model.js";
import Match from "../../match/match.model.js";

/**
 * GET /api/series/:seriesId/points-table
 * Get points table for a specific series, calculated dynamically from completed matches
 */
const getSeriesPointsTable = asyncHandler(async (req, res) => {
    const seriesId = ensureId(req.params.seriesId, "series ID");

    const series = await Series.findOne({
        _id: seriesId,
        isDeleted: false,
    }).lean();

    if (!series) {
        throw new ApiError(404, "Series not found");
    }

    // 1. Fetch all teams registered for this series
    const teams = await Team.find({ seriesId, isDeleted: false }).lean();

    // 2. Fetch all completed matches for this series
    const completedMatches = await Match.find({
        seriesId,
        status: "COMPLETED",
        isDeleted: false,
    }).lean();

    // 3. Initialize stats map
    const standingsMap = {};
    for (const team of teams) {
        standingsMap[team._id.toString()] = {
            teamId: team._id,
            teamName: team.name,
            teamShortName: team.shortName,
            logo: team.logo,
            played: 0,
            won: 0,
            lost: 0,
            points: 0,
        };
    }

    // 4. Calculate points based on completed matches
    for (const match of completedMatches) {
        const t1Str = match.team1.toString();
        const t2Str = match.team2.toString();

        if (standingsMap[t1Str] && standingsMap[t2Str]) {
            standingsMap[t1Str].played += 1;
            standingsMap[t2Str].played += 1;

            if (match.winner) {
                const winnerStr = match.winner.toString();
                if (winnerStr === t1Str) {
                    standingsMap[t1Str].won += 1;
                    standingsMap[t1Str].points += 2;
                    standingsMap[t2Str].lost += 1;
                } else if (winnerStr === t2Str) {
                    standingsMap[t2Str].won += 1;
                    standingsMap[t2Str].points += 2;
                    standingsMap[t1Str].lost += 1;
                }
            }
        }
    }

    // 5. Convert to array and sort by points desc, won desc
    const standings = Object.values(standingsMap).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.won - a.won;
    });

    const pointsTable = {
        seriesId,
        seriesName: series.name,
        format: series.format,
        standings,
        lastUpdated: new Date(),
    };

    res.status(200).json(
        respondSuccess(pointsTable, "Points table retrieved successfully")
    );
});

const router = express.Router({ mergeParams: true });
router.get("/", responseCache(30), getSeriesPointsTable);

export default router;
