import mongoose from "mongoose";
import { MATCH_STATUS, TOSS_DECISION } from "../../constant/model.constant.js";

const playingXIParticipantSchema = new mongoose.Schema(
    {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true,
        },
        isCaptain: {
            type: Boolean,
            default: false,
        },
        isWicketKeeper: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const matchSchema = new mongoose.Schema(
    {
        seriesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: [true, "Series ID is required"],
            index: true,
        },

        matchNumber: {
            type: String,
            trim: true,
            default: "",
        },

        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },

        startTime: {
            type: Date,
            required: [true, "Start time is required"],
        },

        status: {
            type: String,
            enum: Object.values(MATCH_STATUS),
            default: MATCH_STATUS.UPCOMING,
        },

        team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Team 1 ID is required"],
        },

        team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Team 2 ID is required"],
        },

        tossWinner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null,
        },

        tossDecision: {
            type: String,
            enum: [...Object.values(TOSS_DECISION), null],
            default: null,
        },

        playingXI: {
            team1: [playingXIParticipantSchema],
            team2: [playingXIParticipantSchema],
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null,
        },

        result: {
            type: String,
            trim: true,
            default: "",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes
matchSchema.index({ status: 1, startTime: 1, isDeleted: 1 });
matchSchema.index({ seriesId: 1, startTime: 1, isDeleted: 1 });
matchSchema.index({ team1: 1, startTime: 1, isDeleted: 1 });
matchSchema.index({ team2: 1, startTime: 1, isDeleted: 1 });

// Exclude soft-deleted matches
matchSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

const Match = mongoose.model("Match", matchSchema);

export default Match;
