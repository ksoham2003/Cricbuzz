import SquadRepository from "./squad.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export default class SquadService {
    constructor() {
        this.squadRepository = new SquadRepository();
    }

    /**
     * Verify series exists and is active.
     */
    async _ensureSeriesExists(seriesId) {
        if (!mongoose.isObjectIdOrHexString(seriesId)) {
            throw new ApiError(400, "Invalid series ID");
        }
        const series = await mongoose.connection.collection("series").findOne({
            _id: new mongoose.Types.ObjectId(seriesId),
            isDeleted: false,
        });
        if (!series) {
            throw new ApiError(404, "Series not found");
        }
        return series;
    }

    /**
     * Verify team exists and is active.
     */
    async _ensureTeamExists(teamId) {
        if (!mongoose.isObjectIdOrHexString(teamId)) {
            throw new ApiError(400, "Invalid team ID");
        }
        const team = await mongoose.connection.collection("teams").findOne({
            _id: new mongoose.Types.ObjectId(teamId),
            isDeleted: false,
        });
        if (!team) {
            throw new ApiError(404, "Team not found");
        }
        return team;
    }

    /**
     * Create a new squad after validating unique compound key and team/series existence.
     */
    async createSquad(data) {
        const { seriesId, teamId } = data;

        await this._ensureSeriesExists(seriesId);
        await this._ensureTeamExists(teamId);

        // One squad per team per series
        const existing = await this.squadRepository.findByTeamAndSeries(teamId, seriesId);
        if (existing) {
            throw new ApiError(400, "Squad already exists");
        }

        const squad = await this.squadRepository.createSquad(data);
        return squad;
    }

    /**
     * Fetch all squads matching a filter (e.g. seriesId)
     */
    async getSquads(query = {}) {
        const filter = { isDeleted: false };
        if (query.seriesId) {
            if (!mongoose.isObjectIdOrHexString(query.seriesId)) {
                throw new ApiError(400, "Invalid series ID");
            }
            filter.seriesId = query.seriesId;
        }
        return await this.squadRepository.findAll(filter);
    }

    /**
     * Get a single squad by ID
     */
    async getSquad(id) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid squad ID");
        }
        const squad = await this.squadRepository.findSquadById(id, true);
        if (!squad) {
            throw new ApiError(404, "Squad not found");
        }
        return squad;
    }

    /**
     * Get squads for a specific team
     */
    async getSquadByTeam(teamId) {
        if (!mongoose.isObjectIdOrHexString(teamId)) {
            throw new ApiError(400, "Invalid team ID");
        }
        await this._ensureTeamExists(teamId);
        return await this.squadRepository.findSquadByTeam(teamId);
    }

    /**
     * Add a player to squad with active check, size check, team validation, and duplicates check.
     */
    async addPlayerToSquad(squadId, playerId) {
        if (!mongoose.isObjectIdOrHexString(squadId)) {
            throw new ApiError(400, "Invalid squad ID");
        }
        if (!mongoose.isObjectIdOrHexString(playerId)) {
            throw new ApiError(400, "Invalid player ID");
        }

        const squad = await this.squadRepository.findSquadById(squadId);
        if (!squad) {
            throw new ApiError(404, "Squad not found");
        }

        if (squad.status === "LOCKED") {
            throw new ApiError(400, "Squad is locked");
        }

        if (squad.players.length >= 25) {
            throw new ApiError(400, "Maximum squad size exceeded");
        }

        // Verify player exists
        const player = await mongoose.connection.collection("players").findOne({
            _id: new mongoose.Types.ObjectId(playerId),
            isDeleted: false,
        });
        if (!player) {
            throw new ApiError(404, "Player not found");
        }

        // Verify player belongs to team
        if (player.teamId.toString() !== squad.teamId.toString()) {
            throw new ApiError(400, "Player does not belong to team");
        }

        // Verify duplicate check
        const playerAlreadyAdded = squad.players.some(
            (id) => id.toString() === playerId.toString()
        );
        if (playerAlreadyAdded) {
            throw new ApiError(400, "Player already added to squad");
        }

        await this.squadRepository.addPlayer(squadId, playerId);
        return { message: "Player added successfully" };
    }

    /**
     * Remove player from squad.
     */
    async removePlayerFromSquad(squadId, playerId) {
        if (!mongoose.isObjectIdOrHexString(squadId)) {
            throw new ApiError(400, "Invalid squad ID");
        }
        if (!mongoose.isObjectIdOrHexString(playerId)) {
            throw new ApiError(400, "Invalid player ID");
        }

        const squad = await this.squadRepository.findSquadById(squadId);
        if (!squad) {
            throw new ApiError(404, "Squad not found");
        }

        if (squad.status === "LOCKED") {
            throw new ApiError(400, "Squad is locked");
        }

        const playerInSquad = squad.players.some(
            (id) => id.toString() === playerId.toString()
        );
        if (!playerInSquad) {
            throw new ApiError(400, "Player not found in squad");
        }

        await this.squadRepository.removePlayer(squadId, playerId);
        return { message: "Player removed successfully" };
    }

    /**
     * Lock squad or update status (minimum 11 players required for locking).
     */
    async updateSquadStatus(squadId, status) {
        if (!mongoose.isObjectIdOrHexString(squadId)) {
            throw new ApiError(400, "Invalid squad ID");
        }

        const squad = await this.squadRepository.findSquadById(squadId);
        if (!squad) {
            throw new ApiError(404, "Squad not found");
        }

        if (status === "LOCKED" && squad.players.length < 11) {
            throw new ApiError(400, "Squad must have at least 11 players to be locked");
        }

        const updated = await this.squadRepository.updateSquad(squadId, { status });
        return updated;
    }
}
