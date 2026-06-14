import mongoose from "mongoose";
import { BATTING_STYLE, BOWLING_STYLE, PLAYER_ROLE, PLAYER_STATUS } from "../../constant/model.constant.js";

const playerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },

        fullName: {
            type: String,
            trim: true,
        },

        profileImage: {
            type: String,
            default: "",
        },

        jerseyNumber: {
            type: Number,
            default: null,
        },

        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [10, "Invalid player age"],
        },

        battingStyle: {
            type: String,
            enum: {
                values: Object.values(BATTING_STYLE),
                message: "Invalid batting style",
            },
            default: null,
        },

        bowlingStyle: {
            type: String,
            enum: {
                values: Object.values(BOWLING_STYLE),
                message: "Invalid bowling style",
            },
            default: null,
        },

        role: {
            type: String,
            required: [true, "Player role is required"],
            enum: {
                values: Object.values(PLAYER_ROLE),
                message: "Invalid player role",
            },
        },

        nationality: {
            type: String,
            trim: true,
            default: "",
        },

        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Team ID is required"],
            index: true,
        },

        matchesPlayed: {
            type: Number,
            default: 0,
            min: 0,
        },

        runs: {
            type: Number,
            default: 0,
            min: 0,
        },

        wickets: {
            type: Number,
            default: 0,
            min: 0,
        },

        catches: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: Object.values(PLAYER_STATUS),
            default: PLAYER_STATUS.ACTIVE,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to auto-generate fullName
playerSchema.pre("save", function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
    next();
});

// Pre-query hook to transparently exclude soft-deleted records
playerSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
