import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { default as SeriesModel } from "../../series/series.model.js";
import { default as TeamModel } from "../../team/team.model.js";
import { default as MatchModel } from "../../match/match.model.js";

/**
 * GET /api/series
 * Get paginated list of all series
 */
const getAllSeries = asyncHandler(async (req, res) => {
    const { page, limit, skip } = pagination(req.query);

    const series = await SeriesModel.find({ isDeleted: false })
        .select("name shortName description format status logo startDate endDate totalTeams")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    const total = await SeriesModel.countDocuments({ isDeleted: false });

    res.status(200).json(
        respondPaginated(series, paginationMeta(page, limit, total), "Series retrieved successfully")
    );
});

/**
 * GET /api/series/:id
 * Get single series details
 */
const getSeriesById = asyncHandler(async (req, res) => {
    const seriesId = ensureId(req.params.id, "series ID");

    const series = await SeriesModel.findOne({
        _id: seriesId,
        isDeleted: false,
    }).lean();

    if (!series) {
        const { ApiError } = await import("../../../utils/ApiError.js");
        throw new ApiError(404, "Series not found");
    }

    res.status(200).json(
        respondSuccess(series, "Series retrieved successfully")
    );
});

/**
 * GET /api/series/:id/points-table
 * Get points table for a series
 */
const getPointsTable = asyncHandler(async (req, res) => {
    const seriesId = ensureId(req.params.id, "series ID");

    const series = await SeriesModel.findOne({
        _id: seriesId,
        isDeleted: false,
    }).lean();

    if (!series) {
        const { ApiError } = await import("../../../utils/ApiError.js");
        throw new ApiError(404, "Series not found");
    }

    const teams = await TeamModel.find({ seriesId, isDeleted: false }).lean();
    const completedMatches = await MatchModel.find({
        seriesId,
        status: "COMPLETED",
        isDeleted: false,
    }).lean();

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

    const standings = Object.values(standingsMap).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.won - a.won;
    });

    res.status(200).json(
        respondSuccess({
            seriesId,
            seriesName: series.name,
            pointsTable: standings,
        }, "Points table retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(60), getAllSeries);
router.get("/:id", responseCache(60), getSeriesById);
router.get("/:id/points-table", responseCache(30), getPointsTable);

export default router;
