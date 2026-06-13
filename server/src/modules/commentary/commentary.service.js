import mongoose from "mongoose";
import CommentaryRepository from "./commentary.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export default class CommentaryService {
    constructor(commentaryRepository = new CommentaryRepository()) {
        this.commentaryRepository = commentaryRepository;
    }

    async _ensureMatchIsLive(matchId) {
        const match = await mongoose.connection.collection("matches").findOne(
            { _id: new mongoose.Types.ObjectId(matchId) },
            { projection: { status: 1 } }
        );

        if (!match) {
            throw new ApiError(404, "Match not found");
        }

        if (match.status !== "LIVE") {
            throw new ApiError(400, "Match is not live");
        }
    }

    async addCommentary(commentaryData, io) {
        await this._ensureMatchIsLive(commentaryData.matchId);

        const commentary = await this.commentaryRepository.createCommentary(commentaryData);

        if (io) {
            io.to(`match:${commentaryData.matchId}`).emit("commentary.created", commentary);
        }

        return commentary;
    }

    async fetchCommentary(matchId, pagination) {
        const { commentary, total } = await this.commentaryRepository.getCommentaryByMatch(
            matchId,
            pagination
        );

        return {
            commentary,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages: Math.ceil(total / pagination.limit),
            },
        };
    }

    async removeCommentary(id) {
        const commentary = await this.commentaryRepository.findCommentaryById(id);
        if (!commentary) {
            throw new ApiError(404, "Commentary not found");
        }

        await this.commentaryRepository.deleteCommentary(id);
    }
}
