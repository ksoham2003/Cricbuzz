import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { default as PlayerModel } from "../../player/player.model.js";

/**
 * GET /api/players
 * Get paginated list of all players with optional filtering
 */
const getAllPlayers = asyncHandler(async (req, res) => {
    const { page, limit, skip } = pagination(req.query);
    const { role, country } = req.query;

    const filter = { isDeleted: false };
    if (role) filter.role = role;
    if (country) filter.country = country;

    const players = await PlayerModel.find(filter)
        .select("firstName lastName fullName profileImage jerseyNumber age role battingStyle bowlingStyle country")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    const total = await PlayerModel.countDocuments(filter);

    res.status(200).json(
        respondPaginated(players, paginationMeta(page, limit, total), "Players retrieved successfully")
    );
});

/**
 * GET /api/players/:id
 * Get single player details
 */
const getPlayerById = asyncHandler(async (req, res) => {
    const playerId = ensureId(req.params.id, "player ID");

    const player = await PlayerModel.findOne({
        _id: playerId,
        isDeleted: false,
    }).lean();

    if (!player) {
        const { ApiError } = await import("../../../utils/ApiError.js");
        throw new ApiError(404, "Player not found");
    }

    res.status(200).json(
        respondSuccess(player, "Player retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(60), getAllPlayers);
router.get("/:id", responseCache(60), getPlayerById);

export default router;
