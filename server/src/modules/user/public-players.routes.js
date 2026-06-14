import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";
import { default as PlayerModel } from "../player/player.model.js";

/**
 * GET /api/players
 * Returns paginated list of all players
 * Cache: 60 seconds
 */
export const getAllPlayers = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const { role, country } = req.query;

    const filter = { isDeleted: false };
    if (role) filter.role = role;
    if (country) filter.country = country;

    const players = await PlayerModel.find(filter)
        .skip(skip)
        .limit(limit)
        .select('firstName lastName fullName profileImage jerseyNumber age role battingStyle bowlingStyle country')
        .sort({ createdAt: -1 })
        .lean();

    const total = await PlayerModel.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            data: players,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        }, "Players retrieved successfully")
    );
});

/**
 * GET /api/players/:id
 * Returns detailed player information
 * Cache: 60 seconds
 */
export const getPlayerById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError(400, "Invalid player ID");
    }

    const player = await PlayerModel.findOne({
        _id: id,
        isDeleted: false,
    }).lean();

    if (!player) {
        throw new ApiError(404, "Player not found");
    }

    res.status(200).json(
        new ApiResponse(200, player, "Player details retrieved successfully")
    );
});
