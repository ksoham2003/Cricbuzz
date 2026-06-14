import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { default as SeriesModel } from "../../series/series.model.js";

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

    // Return empty points table (to be populated with match data)
    res.status(200).json(
        respondSuccess({
            seriesId,
            seriesName: series.name,
            pointsTable: [],
        }, "Points table retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(60), getAllSeries);
router.get("/:id", responseCache(60), getSeriesById);
router.get("/:id/points-table", responseCache(30), getPointsTable);

export default router;
