import PlayerService from "./player.service.js";
import { createPlayerSchema, updatePlayerSchema } from "./player.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class PlayerController {
    constructor() {
        this.playerService = new PlayerService();
    }

    /**
     * POST /api/players
     * Creates a new player. Restricted to ADMIN and SUPER_ADMIN.
     */
    createPlayerController = asyncHandler(async (req, res) => {
        const validation = createPlayerSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        const result = await this.playerService.createPlayer(validation.data, req.user.id);

        return res
            .status(201)
            .json(new ApiResponse(201, { player: result }, "Player created successfully"));
    });

    /**
     * GET /api/players
     * Returns a paginated list of players based on filters.
     */
    getPlayersController = asyncHandler(async (req, res) => {
        const { page, limit, teamId, role, status, search } = req.query;

        const result = await this.playerService.getPlayers({ page, limit, teamId, role, status, search });

        return res.status(200).json(
            new ApiResponse(200, {
                count: result.count,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                data: result.data,
            })
        );
    });

    /**
     * GET /api/players/:id
     * Returns a single player by ID.
     */
    getPlayerController = asyncHandler(async (req, res) => {
        const player = await this.playerService.getPlayerById(req.params.id);

        return res.status(200).json(new ApiResponse(200, { player }));
    });

    /**
     * PATCH /api/players/:id
     * Updates a player. Restricted to ADMIN and SUPER_ADMIN.
     */
    updatePlayerController = asyncHandler(async (req, res) => {
        const validation = updatePlayerSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        if (Object.keys(validation.data).length === 0) {
            throw new ApiError(400, "No update fields provided");
        }

        const updated = await this.playerService.updatePlayer(req.params.id, validation.data);

        return res
            .status(200)
            .json(new ApiResponse(200, { player: updated }, "Player updated successfully"));
    });

    /**
     * DELETE /api/players/:id
     * Soft deletes a player. Restricted to ADMIN and SUPER_ADMIN.
     */
    deletePlayerController = asyncHandler(async (req, res) => {
        await this.playerService.removePlayer(req.params.id);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Player deleted successfully"));
    });

    /**
     * POST /api/players/:id/image
     * Uploads/updates a player profile image. Restricted to ADMIN and SUPER_ADMIN.
     */
    uploadPlayerImageController = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, "Please upload an image file");
        }

        const relativePath = `/uploads/${req.file.filename}`;
        const updated = await this.playerService.updatePlayerImage(req.params.id, relativePath);

        return res
            .status(200)
            .json(new ApiResponse(200, { player: updated }, "Profile image uploaded successfully"));
    });
}

export default new PlayerController();
