import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const oversRegex = /^\d+\.[0-5]$/;

export const scoreIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, { message: "Invalid score ID format" }),
});

export const matchIdParamSchema = z.object({
    matchId: z.string().regex(objectIdRegex, { message: "Invalid match ID format" }),
});

export const createScoreSchema = z.object({
    matchId: z
        .string({ required_error: "Match ID is required" })
        .regex(objectIdRegex, { message: "Invalid match ID format" }),

    innings: z
        .number({ required_error: "Innings number is required" })
        .int()
        .min(1, "Innings must be at least 1"),

    battingTeam: z
        .string({ required_error: "Batting team ID is required" })
        .regex(objectIdRegex, { message: "Invalid batting team ID format" }),

    score: z
        .number()
        .int()
        .min(0, "Score cannot be negative")
        .default(0),

    wickets: z
        .number()
        .int()
        .min(0, "Wickets cannot be negative")
        .max(10, "Wickets cannot exceed 10")
        .default(0),

    overs: z
        .string()
        .regex(oversRegex, { message: "Overs must be in X.Y format (where Y is 0-5)" })
        .default("0.0"),

    runRate: z
        .number()
        .min(0, "Run rate cannot be negative")
        .default(0),

    target: z
        .number()
        .int()
        .min(0, "Target cannot be negative")
        .optional()
        .nullable(),
});

export const updateScoreSchema = z.object({
    score: z.number().int().min(0).optional(),
    wickets: z.number().int().min(0).max(10).optional(),
    overs: z.string().regex(oversRegex, { message: "Overs must be in X.Y format (where Y is 0-5)" }).optional(),
    runRate: z.number().min(0).optional(),
    target: z.number().int().min(0).optional().nullable(),
});
