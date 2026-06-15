import Squad from "./squad.model.js";

export default class SquadRepository {
    async createSquad(data) {
        return await Squad.create(data);
    }

    async findSquadById(id, populate = false) {
        let query = Squad.findById(id);
        if (populate) {
            query = query
                .populate("players")
                .populate({ path: "teamId", select: "name shortName logo primaryColor secondaryColor city coach captain" })
                .populate({ path: "seriesId", select: "name shortName description format startDate endDate" });
        }
        return await query.lean();
    }

    async findSquadByTeam(teamId) {
        return await Squad.find({ teamId }).populate("players").lean();
    }

    async findByTeamAndSeries(teamId, seriesId) {
        return await Squad.findOne({ teamId, seriesId }).lean();
    }

    async findAll(filter = {}, options = {}) {
        const { skip = 0, limit = 10 } = options;
        return await Squad.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("players")
            .sort({ createdAt: -1 })
            .lean();
    }

    async countAll(filter = {}) {
        return await Squad.countDocuments(filter);
    }

    async addPlayer(squadId, playerId) {
        return await Squad.findByIdAndUpdate(
            squadId,
            {
                $addToSet: { players: playerId },
                $inc: { totalPlayers: 1 }
            },
            { new: true, runValidators: true }
        ).lean();
    }

    async removePlayer(squadId, playerId) {
        return await Squad.findByIdAndUpdate(
            squadId,
            {
                $pull: { players: playerId },
                $inc: { totalPlayers: -1 }
            },
            { new: true, runValidators: true }
        ).lean();
    }

    async updateSquad(id, updateData) {
        return await Squad.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    }

    async deleteSquad(id) {
        return await Squad.findByIdAndUpdate(
            id,
            { isDeleted: true, status: "INACTIVE" },
            { new: true }
        ).lean();
    }
}
