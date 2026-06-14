import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

// Import models
import { default as SeriesModel } from "../series/series.model.js";
import { default as TeamModel } from "../team/team.model.js";
import { default as PlayerModel } from "../player/player.model.js";
import { default as CommentaryModel } from "../commentary/commentary.model.js";

/**
 * GET /api/home
 * Returns categorized match lists (live/upcoming/recent)
 * Cache: 10 seconds
 */
export const getHome = asyncHandler(async (req, res) => {
    const seriesList = await SeriesModel.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    res.status(200).json(
        new ApiResponse(200, {
            series: seriesList,
            totalSeries: await SeriesModel.countDocuments({ isDeleted: false }),
        }, "Home data retrieved successfully")
    );
});

/**
 * GET /api/series
 * Returns paginated list of all series
 * Cache: 60 seconds
 */
export const getAllSeries = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const series = await SeriesModel.find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .select('name shortName description format startDate endDate status totalTeams logo')
        .sort({ createdAt: -1 })
        .lean();

    const total = await SeriesModel.countDocuments({ isDeleted: false });

    res.status(200).json(
        new ApiResponse(200, {
            data: series,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        }, "Series retrieved successfully")
    );
});

/**
 * GET /api/series/:id
 * Returns detailed series information
 * Cache: 60 seconds
 */
export const getSeriesById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError(400, "Invalid series ID");
    }

    const series = await SeriesModel.findOne({
        _id: id,
        isDeleted: false,
    }).lean();

    if (!series) {
        throw new ApiError(404, "Series not found");
    }

    res.status(200).json(
        new ApiResponse(200, series, "Series details retrieved successfully")
    );
});

/**
 * GET /api/series/:id/points-table
 * Returns derived points table for a series
 * Cache: 30 seconds
 */
export const getSeriesPointsTable = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError(400, "Invalid series ID");
    }

    const series = await SeriesModel.findOne({
        _id: id,
        isDeleted: false,
    }).lean();

    if (!series) {
        throw new ApiError(404, "Series not found");
    }

    // Fetch all teams in series (will be implemented with Match model)
    // For now, return empty points table
    res.status(200).json(
        new ApiResponse(200, {
            seriesId: id,
            seriesName: series.name,
            pointsTable: [],
        }, "Points table retrieved successfully")
    );
});
