import Match from "../match/match.model.js";
import Squad from "../squad/squad.model.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export default class PlayingXiService {
    /**
     * Validate the playing XI for a team.
     * @param {string} squadId - Squad ID for this team in this series
     * @param {Array} xiList - List of selected players
     */
    async validateTeamXi(squadId, xiList) {
        if (xiList.length !== 11) {
            throw new ApiError(400, "Team playing XI must have exactly 11 players");
        }

        // 1. Check duplicate players in XI
        const playerIds = xiList.map(item => item.player.toString());
        const uniquePlayers = new Set(playerIds);
        if (uniquePlayers.size !== 11) {
            throw new ApiError(400, "Duplicate players are not allowed in playing XI");
        }

        // 2. Check exactly 1 captain and exactly 1 wicket-keeper
        const captains = xiList.filter(item => item.isCaptain);
        if (captains.length !== 1) {
            throw new ApiError(400, "Team playing XI must have exactly one captain");
        }

        const keepers = xiList.filter(item => item.isWicketKeeper);
        if (keepers.length !== 1) {
            throw new ApiError(400, "Team playing XI must have exactly one wicket-keeper");
        }

        // 3. Verify squad exists and contains all players
        const squad = await Squad.findById(squadId).lean();
        if (!squad) {
            throw new ApiError(404, "Squad not found for team in this series");
        }

        const squadPlayerIds = squad.players.map(id => id.toString());
        for (const playerId of playerIds) {
            if (!squadPlayerIds.includes(playerId)) {
                throw new ApiError(400, `Player with ID ${playerId} is not in the registered squad`);
            }
        }
    }

    /**
     * Select playing XI for both teams in a match.
     * @param {string} matchId
     * @param {Object} playingXiData - { team1: Array, team2: Array }
     * @param {Object} io - socket.io instance
     */
    async selectPlayingXi(matchId, playingXiData, io) {
        if (!mongoose.isObjectIdOrHexString(matchId)) {
            throw new ApiError(400, "Invalid match ID format");
        }

        const match = await Match.findById(matchId);
        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        // Verify match status is TOSS_COMPLETED
        if (match.status !== "TOSS_COMPLETED") {
            throw new ApiError(400, "Playing XI can only be selected after toss is completed");
        }

        // Find squads for team1 and team2 for the match series
        const [squad1, squad2] = await Promise.all([
            Squad.findOne({ seriesId: match.seriesId, teamId: match.team1, isDeleted: false }).lean(),
            Squad.findOne({ seriesId: match.seriesId, teamId: match.team2, isDeleted: false }).lean(),
        ]);

        if (!squad1) {
            throw new ApiError(404, "Squad not found for Team 1 in this series");
        }
        if (!squad2) {
            throw new ApiError(404, "Squad not found for Team 2 in this series");
        }

        // Validate XI list for team1
        await this.validateTeamXi(squad1._id, playingXiData.team1);

        // Validate XI list for team2
        await this.validateTeamXi(squad2._id, playingXiData.team2);

        // Update match playing XI and status
        match.playingXI = {
            team1: playingXiData.team1.map(item => ({
                player: new mongoose.Types.ObjectId(item.player),
                isCaptain: item.isCaptain,
                isWicketKeeper: item.isWicketKeeper,
            })),
            team2: playingXiData.team2.map(item => ({
                player: new mongoose.Types.ObjectId(item.player),
                isCaptain: item.isCaptain,
                isWicketKeeper: item.isWicketKeeper,
            })),
        };
        match.status = "PLAYING_XI_SELECTED";

        const updatedMatch = await match.save();

        // Populate match details for socket emission
        const populatedMatch = await Match.findById(updatedMatch._id)
            .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
            .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage")
            .lean();

        if (io) {
            io.to(`match:${matchId}`).emit("playingXI.updated", populatedMatch);
        }

        return populatedMatch;
    }

    /**
     * Get playing XI for a match
     * @param {string} matchId
     */
    async getPlayingXi(matchId) {
        if (!mongoose.isObjectIdOrHexString(matchId)) {
            throw new ApiError(400, "Invalid match ID format");
        }

        const match = await Match.findById(matchId)
            .select("playingXI")
            .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
            .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage")
            .lean();

        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        if (!match.playingXI || !match.playingXI.team1 || !match.playingXI.team2) {
            return null;
        }

        return match.playingXI;
    }

    /**
     * Get playing XI for a specific team in a match
     * @param {string} matchId
     * @param {string} teamNumber - "1" or "2"
     */
    async getTeamPlayingXi(matchId, teamNumber) {
        if (!mongoose.isObjectIdOrHexString(matchId)) {
            throw new ApiError(400, "Invalid match ID format");
        }

        const match = await Match.findById(matchId)
            .select("playingXI")
            .populate(
                teamNumber === "1" ? "playingXI.team1.player" : "playingXI.team2.player",
                "firstName lastName fullName role jerseyNumber profileImage"
            )
            .lean();

        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        const teamKey = `team${teamNumber}`;
        if (!match.playingXI || !match.playingXI[teamKey]) {
            return null;
        }

        return match.playingXI[teamKey];
    }
}
