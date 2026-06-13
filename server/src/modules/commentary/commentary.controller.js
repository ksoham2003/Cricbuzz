import CommentaryService from "./commentary.service.js";
import {
    commentaryIdParamSchema,
    commentaryPaginationSchema,
    createCommentarySchema,
    matchIdParamSchema,
} from "./commentary.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

class CommentaryController {
    constructor() {
        this.commentaryService = new CommentaryService();
    }

    _parse(schema, input) {
        const validation = schema.safeParse(input);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        return validation.data;
    }

    createCommentaryController = asyncHandler(async (req, res) => {
        const commentaryData = this._parse(createCommentarySchema, req.body);
        const commentary = await this.commentaryService.addCommentary(
            commentaryData,
            req.app.get("io")
        );

        return res.status(201).json(
            new ApiResponse(201, commentary, "Commentary added successfully")
        );
    });

    getCommentaryController = asyncHandler(async (req, res) => {
        const { matchId } = this._parse(matchIdParamSchema, req.params);
        const pagination = this._parse(commentaryPaginationSchema, req.query);
        const result = await this.commentaryService.fetchCommentary(matchId, pagination);

        return res.status(200).json(
            new ApiResponse(200, result, "Commentary fetched successfully")
        );
    });

    deleteCommentaryController = asyncHandler(async (req, res) => {
        const { id } = this._parse(commentaryIdParamSchema, req.params);
        await this.commentaryService.removeCommentary(id);

        return res.status(200).json(
            new ApiResponse(200, null, "Commentary deleted successfully")
        );
    });
}

export default new CommentaryController();
