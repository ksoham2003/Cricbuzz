import MatchService from "./match.service.js";
import PlayingXiService from "../playing-xi/playing-xi.service.js";
import {
    createMatchSchema,
    updateMatchSchema,
    tossSchema,
    completeMatchSchema,
    matchIdParamSchema,
} from "./match.validator.js";
import { playingXiSchema } from "../playing-xi/playing-xi.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class MatchController {
    constructor() {
        this.matchService = new MatchService();
        this.playingXiService = new PlayingXiService();
    }

    _parse(schema, input) {
        const validation = schema.safeParse(input);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }
        return validation.data;
    }

    createMatchController = asyncHandler(async (req, res) => {
        const validated = this._parse(createMatchSchema, req.body);
        const match = await this.matchService.createMatch(validated, req.user.id);
        return res
            .status(201)
            .json(new ApiResponse(201, { match }, "Match scheduled successfully"));
    });

    getMatchesController = asyncHandler(async (req, res) => {
        const result = await this.matchService.fetchAllMatches(req.query);
        return res.status(200).json(
            new ApiResponse(200, {
                count: result.count,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                data: result.data,
            })
        );
    });

    getMatchController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const match = await this.matchService.fetchMatchById(id);
        return res.status(200).json(new ApiResponse(200, { match }));
    });

    updateMatchController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const validated = this._parse(updateMatchSchema, req.body);
        if (Object.keys(validated).length === 0) {
            throw new ApiError(400, "No update fields provided");
        }
        const updated = await this.matchService.updateMatchDetails(id, validated);
        return res
            .status(200)
            .json(new ApiResponse(200, { match: updated }, "Match updated successfully"));
    });

    deleteMatchController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        await this.matchService.removeMatch(id);
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Match deleted successfully"));
    });

    recordTossController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const validated = this._parse(tossSchema, req.body);
        const match = await this.matchService.recordToss(id, validated, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { match }, "Toss result recorded successfully"));
    });

    startMatchController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const match = await this.matchService.startMatch(id, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { match }, "Match started successfully"));
    });

    inningsBreakController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const match = await this.matchService.inningsBreak(id, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { match }, "Match entered innings break"));
    });

    completeMatchController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const validated = this._parse(completeMatchSchema, req.body);
        const match = await this.matchService.completeMatch(id, validated, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { match }, "Match completed successfully"));
    });

    selectPlayingXiController = asyncHandler(async (req, res) => {
        const { id } = this._parse(matchIdParamSchema, req.params);
        const validated = this._parse(playingXiSchema, req.body);
        const match = await this.playingXiService.selectPlayingXi(id, validated, req.app.get("io"));
        return res
            .status(200)
            .json(new ApiResponse(200, { match }, "Playing XI selected successfully"));
    });
}

export default new MatchController();
