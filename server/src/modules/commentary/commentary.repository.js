import Commentary from "./commentary.model.js";

export default class CommentaryRepository {
    async createCommentary(commentaryData) {
        return Commentary.create(commentaryData);
    }

    async getCommentaryByMatch(matchId, { page, limit }) {
        const skip = (page - 1) * limit;
        const filter = { matchId };

        const [commentary, total] = await Promise.all([
            Commentary.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Commentary.countDocuments(filter),
        ]);

        return { commentary, total };
    }

    async findCommentaryById(id) {
        return Commentary.findById(id);
    }

    async deleteCommentary(id) {
        return Commentary.findByIdAndDelete(id);
    }
}
