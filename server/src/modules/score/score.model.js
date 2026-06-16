import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
    {
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: [true, "Match ID is required"],
            index: true,
        },

        innings: {
            type: Number,
            required: [true, "Innings number is required"],
            min: [1, "Innings must be at least 1"],
        },

        battingTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Batting team ID is required"],
        },

        score: {
            type: Number,
            default: 0,
            min: [0, "Score cannot be negative"],
        },

        wickets: {
            type: Number,
            default: 0,
            min: [0, "Wickets cannot be negative"],
            max: [10, "Wickets cannot exceed 10"],
        },

        overs: {
            type: String,
            default: "0.0",
            validate: {
                validator: function (v) {
                    return /^\d+\.[0-5]$/.test(v);
                },
                message: props => `${props.value} is not a valid overs format (X.Y where Y is 0-5)!`
            }
        },

        runRate: {
            type: Number,
            default: 0,
            min: [0, "Run rate cannot be negative"],
        },

        target: {
            type: Number,
            default: null,
            min: [0, "Target cannot be negative"],
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

// Compound index on { matchId, innings }
scoreSchema.index({ matchId: 1, innings: 1 }, { unique: true });

// Exclude soft deleted scores
scoreSchema.pre(/^find/, function () {
    this.where({ isDeleted: false });
});

const Score = mongoose.model("Score", scoreSchema);

export default Score;
