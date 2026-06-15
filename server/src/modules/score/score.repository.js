import Score from "./score.model.js";

export default class ScoreRepository {
    async createScore(data) {
        return await Score.create(data);
    }

    async findScoreById(id) {
        return await Score.findById(id).lean();
    }

    async findScoresByMatch(matchId) {
        return await Score.find({ matchId, isDeleted: false })
            .populate("battingTeam", "name shortName logo")
            .lean();
    }

    async updateScore(id, updateData) {
        return await Score.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    }

    async findScoreByMatchAndInnings(matchId, innings) {
        return await Score.findOne({ matchId, innings, isDeleted: false }).lean();
    }
}
