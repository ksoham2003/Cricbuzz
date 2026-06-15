import ScoreService from "./score.service.js";
import {
    createScoreSchema,
    updateScoreSchema,
    scoreIdParamSchema,
    matchIdParamSchema,
} from "./score.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class ScoreController {
    constructor() {
        this.scoreService = new ScoreService();
    }

    _parse(schema, input) {
        const validation = schema.safeParse(input);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }
        return validation.data;
    }

    createScoreController = asyncHandler(async (req, res) => {
        const validated = this._parse(createScoreSchema, req.body);
        const score = await this.scoreService.createScore(validated, req.user.id, req.app.get("io"));
        return res
            .status(201)
            .json(new ApiResponse(201, { score }, "Innings score created successfully"));
    });

    updateScoreController = asyncHandler(async (req, res) => {
        const { id } = this._parse(scoreIdParamSchema, req.params);
        const validated = this._parse(updateScoreSchema, req.body);
        if (Object.keys(validated).length === 0) {
            throw new ApiError(400, "No update fields provided");
        }
        const updated = await this.scoreService.updateScore(id, validated, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { score: updated }, "Score updated successfully"));
    });

    fetchScoresController = asyncHandler(async (req, res) => {
        const { matchId } = this._parse(matchIdParamSchema, req.params);
        const scores = await this.scoreService.fetchScoresByMatch(matchId);
        return res.status(200).json(new ApiResponse(200, { scores }));
    });
}

export default new ScoreController();
