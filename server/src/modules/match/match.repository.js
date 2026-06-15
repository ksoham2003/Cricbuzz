import Match from "./match.model.js";

export default class MatchRepository {
    async createMatch(data) {
        return await Match.create(data);
    }

    async findMatchById(id, populate = false) {
        let query = Match.findById(id);
        if (populate) {
            query = query
                .populate("seriesId", "name shortName status format logo startDate endDate")
                .populate("team1", "name shortName logo primaryColor secondaryColor city")
                .populate("team2", "name shortName logo primaryColor secondaryColor city")
                .populate("tossWinner", "name shortName logo")
                .populate("winner", "name shortName logo")
                .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
                .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage");
        }
        return await query.lean();
    }

    async findMatches(filter = {}, { page = 1, limit = 10, populate = false } = {}) {
        const skip = (page - 1) * limit;
        let query = Match.find(filter).sort({ startTime: 1 }).skip(skip).limit(limit);
        if (populate) {
            query = query
                .populate("seriesId", "name shortName status format logo")
                .populate("team1", "name shortName logo primaryColor")
                .populate("team2", "name shortName logo primaryColor")
                .populate("tossWinner", "name shortName logo")
                .populate("winner", "name shortName logo");
        }
        const [data, count] = await Promise.all([
            query.lean(),
            Match.countDocuments(filter),
        ]);
        return { data, count };
    }

    async updateMatch(id, updateData) {
        return await Match.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    }

    async deleteMatch(id) {
        return await Match.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).lean();
    }
}
