import PlayingXiService from "./playing-xi.service.js";
import { playingXiSchema } from "./playing-xi.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Playing XI Controller
 * Handles playing XI selection for matches
 */
class PlayingXiController {
    constructor() {
        this.playingXiService = new PlayingXiService();
    }

    /**
     * POST /api/playing-xi/:matchId
     * Select playing XI for both teams
     * Requires: ADMIN or SUPER_ADMIN role
     */
    selectPlayingXi = asyncHandler(async (req, res) => {
        const validation = playingXiSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(
                400,
                validation.error.issues[0].message,
                validation.error.issues
            );
        }

        const io = req.app.get("io");
        const result = await this.playingXiService.selectPlayingXi(
            req.params.matchId,
            validation.data,
            io
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { match: result },
                    "Playing XI selected successfully"
                )
            );
    });

    /**
     * GET /api/playing-xi/:matchId
     * Get playing XI for a match
     * Public endpoint
     */
    getPlayingXi = asyncHandler(async (req, res) => {
        const result = await this.playingXiService.getPlayingXi(req.params.matchId);

        if (!result) {
            throw new ApiError(404, "Playing XI not yet selected for this match");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, { playingXI: result }, "Playing XI retrieved successfully")
            );
    });

    /**
     * GET /api/playing-xi/:matchId/team/:teamNumber
     * Get playing XI for a specific team in a match
     * Public endpoint
     * @param {number} teamNumber - 1 or 2
     */
    getTeamPlayingXi = asyncHandler(async (req, res) => {
        const { matchId, teamNumber } = req.params;

        if (!["1", "2"].includes(teamNumber)) {
            throw new ApiError(400, "Team number must be 1 or 2");
        }

        const result = await this.playingXiService.getTeamPlayingXi(matchId, teamNumber);

        if (!result) {
            throw new ApiError(404, `Playing XI not selected for Team ${teamNumber}`);
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { playingXI: result },
                    `Team ${teamNumber} playing XI retrieved successfully`
                )
            );
    });
}

export default new PlayingXiController();
