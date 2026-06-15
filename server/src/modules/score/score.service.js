import ScoreRepository from "./score.repository.js";
import Match from "../match/match.model.js";
import Team from "../team/team.model.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export default class ScoreService {
    constructor() {
        this.scoreRepository = new ScoreRepository();
    }

    /**
     * Helper to verify a match is live.
     * @param {string} matchId
     */
    async _ensureLiveMatch(matchId) {
        const match = await Match.findById(matchId).lean();
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        if (match.status !== "LIVE") {
            throw new ApiError(400, "Match is not live");
        }

        return match;
    }

    /**
     * Create innings score.
     */
    async createScore(data, userId, io) {
        const { matchId, innings, battingTeam } = data;

        if (!mongoose.isObjectIdOrHexString(matchId)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        if (!mongoose.isObjectIdOrHexString(battingTeam)) {
            throw new ApiError(400, "Invalid batting team ID format");
        }

        // Verify match is LIVE
        const match = await this._ensureLiveMatch(matchId);

        // Verify batting team is one of the match teams
        const team1Str = match.team1.toString();
        const team2Str = match.team2.toString();
        if (battingTeam.toString() !== team1Str && battingTeam.toString() !== team2Str) {
            throw new ApiError(400, "Batting team must be one of the playing teams in the match");
        }

        // Verify score for this innings of the match doesn't exist yet
        const existing = await this.scoreRepository.findScoreByMatchAndInnings(matchId, innings);
        if (existing) {
            throw new ApiError(400, `Score already exists for innings ${innings} of this match`);
        }

        const scoreObj = await this.scoreRepository.createScore({
            ...data,
            createdBy: userId,
        });

        const populated = await ScoreRepository.prototype.findScoreById.call(this.scoreRepository, scoreObj._id);

        if (io) {
            io.to(`match:${matchId}`).emit("score.updated", populated);
        }

        return populated;
    }

    /**
     * Update innings score.
     */
    async updateScore(id, updateData, io) {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError(400, "Invalid score ID format");
        }

        const existingScore = await this.scoreRepository.findScoreById(id);
        if (!existingScore) {
            throw new ApiError(404, "Score not found");
        }

        // Verify match is LIVE
        await this._ensureLiveMatch(existingScore.matchId);

        const updated = await this.scoreRepository.updateScore(id, updateData);

        if (io) {
            io.to(`match:${existingScore.matchId}`).emit("score.updated", updated);
        }

        return updated;
    }

    /**
     * Fetch all scores for a match.
     */
    async fetchScoresByMatch(matchId) {
        if (!mongoose.isObjectIdOrHexString(matchId)) {
            throw new ApiError(400, "Invalid match ID format");
        }
        return await this.scoreRepository.findScoresByMatch(matchId);
    }
}
