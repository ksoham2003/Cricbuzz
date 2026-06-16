import express from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { respondSuccess, respondPaginated } from "../shared/respond.js";
import { responseCache } from "../cache/responseCache.js";
import { ensureId, pagination, paginationMeta } from "../shared/query.js";
import { ApiError } from "../../../utils/ApiError.js";
import Match from "../../match/match.model.js";
import Score from "../../score/score.model.js";

/**
 * GET /api/matches
 * Get paginated list of all matches
 */
const getAllMatches = asyncHandler(async (req, res) => {
    const { page, limit, skip } = pagination(req.query);
    const { series, status } = req.query;

    const filter = { isDeleted: false };
    if (series) filter.seriesId = series;
    if (status) filter.status = String(status).toUpperCase();

    const [matches, total] = await Promise.all([
        Match.find(filter)
            .populate("seriesId", "name shortName logo status format")
            .populate("team1", "name shortName logo primaryColor")
            .populate("team2", "name shortName logo primaryColor")
            .sort({ startTime: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Match.countDocuments(filter),
    ]);

    res.status(200).json(
        respondPaginated(matches, paginationMeta(page, limit, total), "Matches retrieved successfully")
    );
});

/**
 * GET /api/matches/:id
 * Get single match details
 */
const getMatchById = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    const match = await Match.findById(matchId)
        .populate("seriesId", "name shortName logo status format startDate endDate")
        .populate("team1", "name shortName logo primaryColor secondaryColor city")
        .populate("team2", "name shortName logo primaryColor secondaryColor city")
        .populate("tossWinner", "name shortName logo")
        .populate("winner", "name shortName logo")
        .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
        .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage")
        .lean();

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    const scores = await Score.find({ matchId, isDeleted: false })
        .populate("battingTeam", "name shortName logo")
        .lean();

    res.status(200).json(
        respondSuccess({ match, scores }, "Match details retrieved successfully")
    );
});

/**
 * GET /api/matches/:id/scorecard
 * Get match scorecard (teams, players, scores)
 */
const getMatchScorecard = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    const match = await Match.findById(matchId)
        .populate("seriesId", "name shortName logo status format")
        .populate("team1", "name shortName logo primaryColor secondaryColor city")
        .populate("team2", "name shortName logo primaryColor secondaryColor city")
        .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
        .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage")
        .lean();

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    const scores = await Score.find({ matchId, isDeleted: false })
        .populate("battingTeam", "name shortName logo")
        .lean();

    const innings1 = scores.find(s => s.innings === 1) || null;
    const innings2 = scores.find(s => s.innings === 2) || null;

    res.status(200).json(
        respondSuccess({
            match,
            innings1,
            innings2,
        }, "Match scorecard retrieved successfully")
    );
});

/**
 * GET /api/matches/:id/center
 * Get match center (live updates)
 */
const getMatchCenter = asyncHandler(async (req, res) => {
    const matchId = ensureId(req.params.id, "match ID");

    const match = await Match.findById(matchId)
        .populate("seriesId", "name shortName logo status format")
        .populate("team1", "name shortName logo primaryColor secondaryColor city")
        .populate("team2", "name shortName logo primaryColor secondaryColor city")
        .populate("tossWinner", "name shortName logo")
        .populate("winner", "name shortName logo")
        .populate("playingXI.team1.player", "firstName lastName fullName role jerseyNumber profileImage")
        .populate("playingXI.team2.player", "firstName lastName fullName role jerseyNumber profileImage")
        .lean();

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    const scores = await Score.find({ matchId, isDeleted: false })
        .populate("battingTeam", "name shortName logo")
        .lean();

    // Live score is the latest innings score
    let liveScore = null;
    if (scores.length > 0) {
        liveScore = scores.reduce((prev, current) => (prev.innings > current.innings) ? prev : current);
    }

    const center = {
        matchInfo: match,
        liveScore,
        scores,
        playingXI: match.playingXI,
        result: match.result,
    };

    res.status(200).json(
        respondSuccess(center, "Match center retrieved successfully")
    );
});

const router = express.Router();
router.get("/", responseCache(10), getAllMatches);
router.get("/:id", responseCache(10), getMatchById);
router.get("/:id/scorecard", responseCache(10), getMatchScorecard);
router.get("/:id/center", responseCache(5), getMatchCenter);

export default router;
