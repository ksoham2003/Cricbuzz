import mongoose from "mongoose";
import { SERIES_STATUS, SERIES_FORMAT } from "../../constant/model.constant.js";

const seriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Series name is required"],
            unique: true,
            trim: true,
        },

        shortName: {
            type: String,
            required: [true, "Short name is required"],
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        format: {
            type: String,
            enum: Object.values(SERIES_FORMAT),
            required: [true, "Series format is required"],
        },

        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },

        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },

        totalTeams: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: Object.values(SERIES_STATUS),
            default: SERIES_STATUS.UPCOMING,
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
seriesSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

const Series = mongoose.model("Series", seriesSchema);

export default Series;
