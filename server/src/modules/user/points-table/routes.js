import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId } from "../shared/query.js";
import { ApiError } from "../../../utils/ApiError.js";
import { default as SeriesModel } from "../../series/series.model.js";

/**
 * GET /api/series/:seriesId/points-table
 * Get points table for a specific series
 * Structure: Array of teams with wins, losses, points, etc.
 */
const getSeriesPointsTable = asyncHandler(async (req, res) => {
    const seriesId = ensureId(req.params.seriesId, "series ID");

    const series = await SeriesModel.findOne({
        _id: seriesId,
        isDeleted: false,
    }).lean();

    if (!series) {
        throw new ApiError(404, "Series not found");
    }

    // Placeholder: Points table to be calculated from matches
    // This will be populated once Match module is implemented
    const pointsTable = {
        seriesId,
        seriesName: series.name,
        format: series.format,
        standings: [], // Will contain team standings
        lastUpdated: new Date(),
    };

    res.status(200).json(
        respondSuccess(pointsTable, "Points table retrieved successfully")
    );
});

const router = express.Router({ mergeParams: true });
router.get("/", responseCache(60), getSeriesPointsTable);

export default router;
