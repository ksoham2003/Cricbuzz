import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { default as SeriesModel } from "../../series/series.model.js";

/**
 * GET /api/home
 * Returns home page data with featured content
 */
const getHome = asyncHandler(async (req, res) => {
    const recentSeries = await SeriesModel.find({ isDeleted: false })
        .select("name shortName description status format logo startDate endDate")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const totalSeries = await SeriesModel.countDocuments({ isDeleted: false });

    res.status(200).json(
        respondSuccess({
            recentSeries,
            totalSeries,
        }, "Home data retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(10), getHome);

export default router;
