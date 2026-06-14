import PlayerRepository from "./player.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export default class PlayerService {
    constructor() {
        this.playerRepository = new PlayerRepository();
    }

    /**
     * Verify the referenced team exists and is not deleted.
     * Uses a raw collection query to avoid circular dependencies.
     * @param {string} teamId
     */
    async _ensureTeamExists(teamId) {
        if (!mongoose.isObjectIdOrHexString(teamId)) {
            throw new ApiError(400, "Invalid team ID");
        }

        const team = await mongoose.connection.collection("teams").findOne(
            { _id: new mongoose.Types.ObjectId(teamId), isDeleted: false },
            { projection: { _id: 1 } }
        );

        if (!team) {
            throw new ApiError(404, "Team not found");
        }
    }

    /**
     * Create a new player.
     * @param {import("./player.interface.js").PlayerInput} data
     * @param {string} userId
     */
    async createPlayer(data, userId) {
        const { teamId, jerseyNumber, age } = data;

        await this._ensureTeamExists(teamId);

        if (age < 10) {
            throw new ApiError(400, "Invalid player age");
        }

        if (jerseyNumber !== undefined && jerseyNumber !== null) {
            const existingJersey = await this.playerRepository.findPlayerByJersey(teamId, jerseyNumber);
            if (existingJersey) {
                throw new ApiError(400, "Jersey number already exists");
            }
        }

        const player = await this.playerRepository.createPlayer({
            ...data,
            createdBy: userId,
        });

        return player;
    }

    /**
     * Get list of players with filters.
     */
    async getPlayers(query) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

        return await this.playerRepository.findPlayers({
            page,
            limit,
            teamId: query.teamId,
            role: query.role,
            status: query.status,
            search: query.search,
        });
    }

    /**
     * Get player by ID.
     * @param {string} id
     */
    async getPlayerById(id) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid player ID");
        }

        const player = await this.playerRepository.findPlayerById(id);
        if (!player) {
            throw new ApiError(404, "Player not found");
        }

        return player;
    }

    /**
     * Update player by ID.
     * Handles jersey validation, team changes, and auto-updating fullName.
     * @param {string} id
     * @param {import("./player.interface.js").PlayerUpdateInput} data
     */
    async updatePlayer(id, data) {
        const existing = await this.getPlayerById(id);

        const newTeamId = data.teamId || existing.teamId.toString();
        const newJerseyNumber = data.jerseyNumber !== undefined ? data.jerseyNumber : existing.jerseyNumber;

        // If team is changing, verify the new team exists
        if (data.teamId && data.teamId.toString() !== existing.teamId.toString()) {
            await this._ensureTeamExists(data.teamId);
        }

        // If jersey or team changed, verify jersey uniqueness
        if (newJerseyNumber !== null) {
            const jerseyConflict = await this.playerRepository.findPlayerByJersey(newTeamId, newJerseyNumber, id);
            if (jerseyConflict) {
                throw new ApiError(400, "Jersey number already exists");
            }
        }

        // Handle age validation if age is updated
        if (data.age !== undefined && data.age < 10) {
            throw new ApiError(400, "Invalid player age");
        }

        // If names are updated, regenerate fullName
        const updatedData = { ...data };
        if (data.firstName || data.lastName) {
            const newFirstName = data.firstName || existing.firstName;
            const newLastName = data.lastName || existing.lastName;
            updatedData.fullName = `${newFirstName} ${newLastName}`.trim();
        }

        const updated = await this.playerRepository.updatePlayer(id, updatedData);
        if (!updated) {
            throw new ApiError(404, "Player not found");
        }

        return updated;
    }

    /**
     * Soft delete a player.
     * @param {string} id
     */
    async removePlayer(id) {
        const existing = await this.getPlayerById(id);
        await this.playerRepository.deletePlayer(id);
    }

    /**
     * Update player profile image path.
     * @param {string} id
     * @param {string} profileImagePath
     */
    async updatePlayerImage(id, profileImagePath) {
        await this.getPlayerById(id);
        const updated = await this.playerRepository.updatePlayer(id, { profileImage: profileImagePath });
        return updated;
    }
}
