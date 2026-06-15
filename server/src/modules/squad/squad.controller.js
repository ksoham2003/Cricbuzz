import SquadService from "./squad.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {
    createSquadSchema,
    addPlayerSchema,
    updateStatusSchema,
    squadIdSchema,
} from "./squad.validator.js";
import mongoose from "mongoose";

class SquadController {
    constructor() {
        this.squadService = new SquadService();
    }

    createSquadController = asyncHandler(async (req, res) => {
        const validation = createSquadSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const squad = await this.squadService.createSquad(validation.data);
        res.status(201).json(new ApiResponse(201, squad, "Squad created successfully"));
    });

    getSquadsController = asyncHandler(async (req, res) => {
        const squads = await this.squadService.getSquads(req.query);
        res.status(200).json(new ApiResponse(200, squads, "Squads retrieved successfully"));
    });

    getSquadController = asyncHandler(async (req, res) => {
        const validation = squadIdSchema.safeParse({ id: req.params.id });
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const squad = await this.squadService.getSquad(req.params.id);
        res.status(200).json(new ApiResponse(200, squad, "Squad retrieved successfully"));
    });

    getSquadByTeamController = asyncHandler(async (req, res) => {
        const squads = await this.squadService.getSquadByTeam(req.params.teamId);
        res.status(200).json(new ApiResponse(200, squads, "Team squads retrieved successfully"));
    });

    addPlayerController = asyncHandler(async (req, res) => {
        const idValidation = squadIdSchema.safeParse({ id: req.params.id });
        if (!idValidation.success) {
            throw new ApiError(400, idValidation.error.issues[0].message);
        }

        const bodyValidation = addPlayerSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            throw new ApiError(400, bodyValidation.error.issues[0].message);
        }

        const result = await this.squadService.addPlayerToSquad(req.params.id, req.body.playerId);
        res.status(200).json(new ApiResponse(200, null, result.message));
    });

    removePlayerController = asyncHandler(async (req, res) => {
        const idValidation = squadIdSchema.safeParse({ id: req.params.id });
        if (!idValidation.success) {
            throw new ApiError(400, idValidation.error.issues[0].message);
        }

        if (!mongoose.isObjectIdOrHexString(req.params.playerId)) {
            throw new ApiError(400, "Invalid player ID");
        }

        const result = await this.squadService.removePlayerFromSquad(req.params.id, req.params.playerId);
        res.status(200).json(new ApiResponse(200, null, result.message));
    });

    updateSquadStatusController = asyncHandler(async (req, res) => {
        const idValidation = squadIdSchema.safeParse({ id: req.params.id });
        if (!idValidation.success) {
            throw new ApiError(400, idValidation.error.issues[0].message);
        }

        const bodyValidation = updateStatusSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            throw new ApiError(400, bodyValidation.error.issues[0].message);
        }

        const updated = await this.squadService.updateSquadStatus(req.params.id, req.body.status);
        res.status(200).json(new ApiResponse(200, updated, "Squad status updated successfully"));
    });
}

export default new SquadController();
