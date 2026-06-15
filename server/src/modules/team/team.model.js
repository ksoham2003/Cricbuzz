import mongoose from "mongoose";
import { TEAM_STATUS } from "../../constant/model.constant.js";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Team name is required"],
            trim: true,
        },

        shortName: {
            type: String,
            required: [true, "Short name is required"],
            uppercase: true,
            trim: true,
            maxlength: [5, "Short name must not exceed 5 characters"],
        },

        logo: {
            type: String,
        },

        primaryColor: {
            type: String,
        },

        secondaryColor: {
            type: String,
        },

        city: {
            type: String,
            trim: true,
        },

        coach: {
            type: String,
            trim: true,
        },

        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            default: null,
        },

        seriesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: [true, "Series ID is required"],
            index: true,
        },

        totalMatches: {
            type: Number,
            default: 0,
            min: 0,
        },

        wins: {
            type: Number,
            default: 0,
            min: 0,
        },

        losses: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: Object.values(TEAM_STATUS),
            default: TEAM_STATUS.ACTIVE,
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

// Exclude soft-deleted documents from all default queries
teamSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

// Unique team name within a series (name + seriesId compound unique)
teamSchema.index({ name: 1, seriesId: 1 }, { unique: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;
