import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { default as CommentaryModel } from "../../commentary/commentary.model.js";

/**
 * GET /api/matches/:matchId/commentary
 * Get paginated commentary for a specific match
 */
const getMatchCommentary = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.matchId, "match ID");
    const { page, limit, skip } = pagination(req.query);

    const commentary = await CommentaryModel.find({
        matchId,
        isDeleted: false,
    })
        .select("ball runs wicket description commentary commentaryType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .lean();

    const total = await CommentaryModel.countDocuments({
        matchId,
        isDeleted: false,
    });

    res.status(200).json(
        respondPaginated(commentary, paginationMeta(page, limit, total), "Match commentary retrieved successfully")
    );
});

const router = express.Router({ mergeParams: true });
router.get("/", responseCache(5), getMatchCommentary);

export default router;
