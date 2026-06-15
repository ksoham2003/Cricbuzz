import MatchRepository from "./match.repository.js";
import Squad from "../squad/squad.model.js";
import Series from "../series/series.model.js";
import Team from "../team/team.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { MATCH_STATUS } from "../../constant/model.constant.js";
import mongoose from "mongoose";

export default class MatchService {
    constructor() {
        this.matchRepository = new MatchRepository();
    }

    /**
     * Create a new match.
     * Enforces series, team existence, and squad player count >= 11.
     * @param {Object} data
     * @param {string} userId
     */
    async createMatch(data, userId) {
        const { seriesId, team1, team2, startTime } = data;

        // Verify series exists
        const series = await Series.findOne({ _id: seriesId, isDeleted: false });
        if (!series) {
            throw new ApiError(404, "Series not found");
        }

        // Verify team1 and team2 exist
        const [t1, t2] = await Promise.all([
            Team.findOne({ _id: team1, isDeleted: false }),
            Team.findOne({ _id: team2, isDeleted: false }),
        ]);

        if (!t1) {
            throw new ApiError(404, "Team 1 not found");
        }
        if (!t2) {
            throw new ApiError(404, "Team 2 not found");
        }

        // Check if teams belong to the same series if team has seriesId field
        if (t1.seriesId.toString() !== seriesId.toString()) {
            throw new ApiError(400, "Team 1 is not registered in the series");
        }
        if (t2.seriesId.toString() !== seriesId.toString()) {
            throw new ApiError(400, "Team 2 is not registered in the series");
        }

        // Verify both team squads exist and contain >= 11 players for this series
        const [squad1, squad2] = await Promise.all([
            Squad.findOne({ seriesId, teamId: team1, isDeleted: false }),
            Squad.findOne({ seriesId, teamId: team2, isDeleted: false }),
        ]);

        if (!squad1) {
            throw new ApiError(400, "Squad not created for Team 1 in this series");
        }
        if (squad1.players.length < 11) {
            throw new ApiError(400, "Team 1 squad must have at least 11 players to schedule a match");
        }

        if (!squad2) {
            throw new ApiError(400, "Squad not created for Team 2 in this series");
        }
        if (squad2.players.length < 11) {
            throw new ApiError(400, "Team 2 squad must have at least 11 players to schedule a match");
        }

        const match = await this.matchRepository.createMatch({
            ...data,
            createdBy: userId,
        });

        return match;
    }

    /**
     * Get all matches (paginated with filters).
     */
    async fetchAllMatches(query) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
        const filter = { isDeleted: false };

        if (query.seriesId) {
            filter.seriesId = query.seriesId;
        }

        if (query.status) {
            filter.status = query.status;
        }

        return await this.matchRepository.findMatches(filter, { page, limit, populate: true });
    }

    /**
     * Get a single match by ID.
     */
    async fetchMatchById(id) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const match = await this.matchRepository.findMatchById(id, true);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }
        return match;
    }

    /**
     * Update match details (ADMIN / SUPER_ADMIN only).
     */
    async updateMatchDetails(id, data) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const existing = await this.matchRepository.findMatchById(id);
        if (!existing) {
            throw new ApiError(404, "Match not found");
        }

        // Validate date ranges or team differences if updating teams
        const team1 = data.team1 || existing.team1;
        const team2 = data.team2 || existing.team2;
        if (team1.toString() === team2.toString()) {
            throw new ApiError(400, "Team 1 and Team 2 must be different teams");
        }

        const updated = await this.matchRepository.updateMatch(id, data);
        return updated;
    }

    /**
     * Record toss result. Transitions status from UPCOMING to TOSS_COMPLETED.
     */
    async recordToss(id, tossData, io) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const match = await MatchRepository.prototype.findMatchById.call(this.matchRepository, id);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        if (match.status !== MATCH_STATUS.UPCOMING) {
            throw new ApiError(400, "Toss can only be conducted for upcoming matches");
        }

        // Verify tossWinner is team1 or team2
        const tossWinnerStr = tossData.tossWinner.toString();
        if (tossWinnerStr !== match.team1.toString() && tossWinnerStr !== match.team2.toString()) {
            throw new ApiError(400, "Toss winner must be one of the playing teams");
        }

        const updated = await this.matchRepository.updateMatch(id, {
            tossWinner: tossData.tossWinner,
            tossDecision: tossData.tossDecision,
            status: MATCH_STATUS.TOSS_COMPLETED,
        });

        // Populate and emit
        const populated = await this.matchRepository.findMatchById(id, true);
        if (io) {
            io.to(`match:${id}`).emit("toss.updated", populated);
        }

        return populated;
    }

    /**
     * Start match. Transitions status to LIVE.
     * Only allowed when status is PLAYING_XI_SELECTED or INNINGS_BREAK.
     */
    async startMatch(id, io) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const match = await MatchRepository.prototype.findMatchById.call(this.matchRepository, id);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        const validStatuses = [MATCH_STATUS.PLAYING_XI_SELECTED, MATCH_STATUS.INNINGS_BREAK];
        if (!validStatuses.includes(match.status)) {
            throw new ApiError(400, "Match can only start after Playing XI is selected or during innings break");
        }

        const updated = await this.matchRepository.updateMatch(id, {
            status: MATCH_STATUS.LIVE,
        });

        const populated = await this.matchRepository.findMatchById(id, true);
        if (io) {
            io.to(`match:${id}`).emit("match.started", populated);
        }

        return populated;
    }

    /**
     * Trigger innings break. Transitions status to INNINGS_BREAK.
     * Only allowed when status is LIVE.
     */
    async inningsBreak(id, io) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const match = await MatchRepository.prototype.findMatchById.call(this.matchRepository, id);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        if (match.status !== MATCH_STATUS.LIVE) {
            throw new ApiError(400, "Innings break can only be triggered for live matches");
        }

        const updated = await this.matchRepository.updateMatch(id, {
            status: MATCH_STATUS.INNINGS_BREAK,
        });

        const populated = await this.matchRepository.findMatchById(id, true);
        if (io) {
            io.to(`match:${id}`).emit("match.updated", populated);
        }

        return populated;
    }

    /**
     * Complete match. Transitions status to COMPLETED.
     * Only allowed when status is LIVE or INNINGS_BREAK.
     */
    async completeMatch(id, completeData, io) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const match = await MatchRepository.prototype.findMatchById.call(this.matchRepository, id);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        const validStatuses = [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK];
        if (!validStatuses.includes(match.status)) {
            throw new ApiError(400, "Match can only be completed from LIVE or INNINGS_BREAK status");
        }

        const winnerStr = completeData.winner.toString();
        if (winnerStr !== match.team1.toString() && winnerStr !== match.team2.toString()) {
            throw new ApiError(400, "Winner must be one of the playing teams");
        }

        const updated = await this.matchRepository.updateMatch(id, {
            winner: completeData.winner,
            result: completeData.result,
            status: MATCH_STATUS.COMPLETED,
        });

        const populated = await this.matchRepository.findMatchById(id, true);
        if (io) {
            io.to(`match:${id}`).emit("match.completed", populated);
        }

        return populated;
    }

    /**
     * Remove match (soft delete).
     */
    async removeMatch(id) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        const existing = await this.matchRepository.findMatchById(id);
        if (!existing) {
            throw new ApiError(404, "Match not found");
        }
        await this.matchRepository.deleteMatch(id);
    }
}
