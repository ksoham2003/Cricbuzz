import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";
import { default as TeamModel } from "../team/team.model.js";

/**
 * GET /api/teams
 * Returns paginated list of all teams
 * Cache: 60 seconds
 */
export const getAllTeams = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const teams = await TeamModel.find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .select('name shortName logo primaryColor secondaryColor city')
        .sort({ createdAt: -1 })
        .lean();

    const total = await TeamModel.countDocuments({ isDeleted: false });

    res.status(200).json(
        new ApiResponse(200, {
            data: teams,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        }, "Teams retrieved successfully")
    );
});

/**
 * GET /api/teams/:id
 * Returns detailed team information
 * Cache: 60 seconds
 */
export const getTeamById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError(400, "Invalid team ID");
    }

    const team = await TeamModel.findOne({
        _id: id,
        isDeleted: false,
    })
        .populate('squadPlayers', 'firstName lastName fullName profileImage jerseyNumber age')
        .lean();

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    res.status(200).json(
        new ApiResponse(200, team, "Team details retrieved successfully")
    );
});
