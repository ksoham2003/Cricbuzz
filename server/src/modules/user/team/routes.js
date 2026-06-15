import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { default as TeamModel } from "../../team/team.model.js";

/**
 * GET /api/teams
 * Get paginated list of all teams
 */
const getAllTeams = asyncHandler(async (req, res) => {
    const { page, limit, skip } = pagination(req.query);

    const teams = await TeamModel.find({ isDeleted: false })
        .select("name shortName logo primaryColor secondaryColor city")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    const total = await TeamModel.countDocuments({ isDeleted: false });

    res.status(200).json(
        respondPaginated(teams, paginationMeta(page, limit, total), "Teams retrieved successfully")
    );
});

/**
 * GET /api/teams/:id
 * Get single team details with squad
 */
const getTeamById = asyncHandler(async (req, res) => {
    const teamId = ensureId(req.params.id, "team ID");

    const team = await TeamModel.findOne({
        _id: teamId,
        isDeleted: false,
    })
        .populate("squadPlayers", "firstName lastName fullName profileImage jerseyNumber age")
        .lean();

    if (!team) {
        const { ApiError } = await import("../../../utils/ApiError.js");
        throw new ApiError(404, "Team not found");
    }

    res.status(200).json(
        respondSuccess(team, "Team retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(60), getAllTeams);
router.get("/:id", responseCache(60), getTeamById);

export default router;
