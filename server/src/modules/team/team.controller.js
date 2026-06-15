import TeamService from "./team.service.js";
import { createTeamSchema, updateTeamSchema } from "./team.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class TeamController {
    constructor() {
        this.teamService = new TeamService();
    }

    /**
     * POST /api/teams
     * Creates a new team. Restricted to ADMIN and SUPER_ADMIN.
     */
    createTeamController = asyncHandler(async (req, res) => {
        const validation = createTeamSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        const result = await this.teamService.createTeam(validation.data, req.user.id);

        return res
            .status(201)
            .json(new ApiResponse(201, { _id: result._id }, "Team created successfully"));
    });

    /**
     * GET /api/teams?page=1&limit=10&seriesId=...&status=ACTIVE&search=mumbai
     * Returns a paginated, filterable list of teams.
     */
    getTeamsController = asyncHandler(async (req, res) => {
        const { page, limit, seriesId, status, search } = req.query;

        const result = await this.teamService.fetchTeams({ page, limit, seriesId, status, search });

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
     * GET /api/teams/:id
     * Returns a single team by ID.
     */
    getTeamByIdController = asyncHandler(async (req, res) => {
        const team = await this.teamService.fetchTeamById(req.params.id);

        return res.status(200).json(new ApiResponse(200, { team }));
    });

    /**
     * PATCH /api/teams/:id
     * Updates a team. Restricted to ADMIN and SUPER_ADMIN.
     */
    updateTeamController = asyncHandler(async (req, res) => {
        const validation = updateTeamSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        if (Object.keys(validation.data).length === 0) {
            throw new ApiError(400, "No update fields provided");
        }

        const updated = await this.teamService.updateTeam(req.params.id, validation.data);

        return res
            .status(200)
            .json(new ApiResponse(200, { team: updated }, "Team updated successfully"));
    });

    /**
     * DELETE /api/teams/:id
     * Soft deletes a team. Restricted to ADMIN and SUPER_ADMIN.
     */
    deleteTeamController = asyncHandler(async (req, res) => {
        await this.teamService.removeTeam(req.params.id);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Team deleted successfully"));
    });

    /**
     * POST /api/teams/:id/logo
     * Uploads/updates a team logo. Restricted to ADMIN and SUPER_ADMIN.
     */
    uploadTeamLogoController = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, "Please upload a logo file");
        }

        const relativePath = `/uploads/${req.file.filename}`;
        const updated = await this.teamService.updateTeamLogo(req.params.id, relativePath);

        return res
            .status(200)
            .json(new ApiResponse(200, { team: updated }, "Team logo uploaded successfully"));
    });
}

export default new TeamController();
