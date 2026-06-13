import mongoose from "mongoose";

export const COMMENTARY_TYPES = {
    NORMAL: "NORMAL",
    FOUR: "FOUR",
    SIX: "SIX",
    WICKET: "WICKET",
    MILESTONE: "MILESTONE",
};

const commentarySchema = new mongoose.Schema(
    {
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true,
            index: true,
        },
        over: {
            type: Number,
            required: true,
            min: 0,
        },
        ball: {
            type: Number,
            required: true,
            min: 1,
            max: 6,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: Object.values(COMMENTARY_TYPES),
            default: COMMENTARY_TYPES.NORMAL,
        },
    },
    { timestamps: true }
);

commentarySchema.index({ matchId: 1, createdAt: -1 });

const Commentary = mongoose.models.Commentary
    || mongoose.model("Commentary", commentarySchema);

export default Commentary;
