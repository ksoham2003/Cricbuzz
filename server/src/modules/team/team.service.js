import TeamRepository from "./team.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export default class TeamService {
    constructor() {
        this.teamRepository = new TeamRepository();
    }

    /**
     * Verify the referenced series exists and is not deleted.
     * Uses a raw collection query so the Team module doesn't import Series model directly.
     * @param {string} seriesId
     */
    async _ensureSeriesExists(seriesId) {
        if (!mongoose.isObjectIdOrHexString(seriesId)) {
            throw new ApiError(400, "Invalid series ID");
        }

        const series = await mongoose.connection.collection("series").findOne(
            { _id: new mongoose.Types.ObjectId(seriesId), isDeleted: false },
            { projection: { _id: 1 } }
        );

        if (!series) {
            throw new ApiError(404, "Series not found");
        }
    }

    /**
     * Create a new team after validating series existence and name uniqueness.
     * @param {import("./team.interface.js").TeamInput} data
     * @param {string} userId
     */
    async createTeam(data, userId) {
        const { name, seriesId } = data;

        await this._ensureSeriesExists(seriesId);

        // Duplicate name check within the same series
        const existing = await this.teamRepository.findTeamByName(name, seriesId);
        if (existing) {
            throw new ApiError(400, "Team already exists in this series");
        }

        const team = await this.teamRepository.createTeam({
            ...data,
            createdBy: userId,
        });

        return { _id: team._id };
    }

    /**
     * Return a paginated list of teams with optional filters.
     * @param {{ page?: number|string, limit?: number|string, seriesId?: string, status?: string, search?: string }} query
     */
    async fetchTeams(query) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

        return await this.teamRepository.findAllTeams({
            page,
            limit,
            seriesId: query.seriesId,
            status: query.status,
            search: query.search,
        });
    }

    /**
     * Fetch a single team by ID, throws 404 if not found.
     * @param {string} id
     */
    async fetchTeamById(id) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid team ID");
        }

        const team = await this.teamRepository.findTeamById(id);
        if (!team) {
            throw new ApiError(404, "Team not found");
        }

        return team;
    }

    /**
     * Update a team. Validates series exists if seriesId is being changed.
     * @param {string} id
     * @param {import("./team.interface.js").TeamUpdateInput} data
     */
    async updateTeam(id, data) {
        const existing = await this.teamRepository.findTeamById(id);
        if (!existing) {
            throw new ApiError(404, "Team not found");
        }

        // If seriesId is being changed, verify the new series exists
        if (data.seriesId && data.seriesId.toString() !== existing.seriesId.toString()) {
            await this._ensureSeriesExists(data.seriesId);
        }

        const updated = await this.teamRepository.updateTeam(id, data);
        if (!updated) {
            throw new ApiError(404, "Team not found");
        }

        return updated;
    }

    /**
     * Soft delete a team.
     * Per spec: cannot delete if team has scheduled matches.
     * @param {string} id
     */
    async removeTeam(id) {
        const existing = await this.teamRepository.findTeamById(id);
        if (!existing) {
            throw new ApiError(404, "Team not found");
        }

        // Check if team has any scheduled/live matches
        const matchCount = await mongoose.connection.collection("matches").countDocuments({
            $or: [{ homeTeam: existing._id }, { awayTeam: existing._id }],
            status: { $in: ["SCHEDULED", "LIVE"] },
            isDeleted: false,
        });

        if (matchCount > 0) {
            throw new ApiError(400, "Cannot delete team with scheduled matches");
        }

        await this.teamRepository.deleteTeam(id);
    }

    /**
     * Update team logo.
     * @param {string} id
     * @param {string} logoPath
     */
    async updateTeamLogo(id, logoPath) {
        await this.fetchTeamById(id);
        const updated = await this.teamRepository.updateTeam(id, { logo: logoPath });
        return updated;
    }
}
