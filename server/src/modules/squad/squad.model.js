import mongoose from "mongoose";

const squadSchema = new mongoose.Schema(
    {
        seriesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: [true, "Series ID is required"],
            index: true,
        },

        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Team ID is required"],
            index: true,
        },

        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
            },
        ],

        totalPlayers: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "LOCKED"],
            default: "ACTIVE",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// One squad per team per series
squadSchema.index({ seriesId: 1, teamId: 1 }, { unique: true });

// Filter out soft-deleted squads by default
squadSchema.pre(/^find/, function () {
    this.where({ isDeleted: false });
});

const Squad = mongoose.model("Squad", squadSchema);

export default Squad;
