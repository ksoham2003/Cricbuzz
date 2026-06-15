import { z } from "zod";
import { TOSS_DECISION } from "../../constant/model.constant.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const matchIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, { message: "Invalid match ID format" }),
});

export const createMatchSchema = z.object({
    seriesId: z
        .string({ required_error: "Series ID is required" })
        .regex(objectIdRegex, { message: "Invalid series ID format" }),

    matchNumber: z
        .string()
        .trim()
        .optional(),

    venue: z
        .string({ required_error: "Venue is required" })
        .min(1, "Venue is required")
        .trim(),

    startTime: z
        .string({ required_error: "Start time is required" })
        .datetime({ message: "Invalid start time format (ISO datetime string required)" }),

    team1: z
        .string({ required_error: "Team 1 ID is required" })
        .regex(objectIdRegex, { message: "Invalid team 1 ID format" }),

    team2: z
        .string({ required_error: "Team 2 ID is required" })
        .regex(objectIdRegex, { message: "Invalid team 2 ID format" }),
}).refine(data => data.team1 !== data.team2, {
    message: "Team 1 and Team 2 must be different teams",
    path: ["team2"],
});

export const updateMatchSchema = z.object({
    seriesId: z.string().regex(objectIdRegex).optional(),
    matchNumber: z.string().trim().optional(),
    venue: z.string().min(1).trim().optional(),
    startTime: z.string().datetime().optional(),
    team1: z.string().regex(objectIdRegex).optional(),
    team2: z.string().regex(objectIdRegex).optional(),
}).refine(data => {
    if (data.team1 && data.team2) {
        return data.team1 !== data.team2;
    }
    return true;
}, {
    message: "Team 1 and Team 2 must be different teams",
    path: ["team2"],
});

export const tossSchema = z.object({
    tossWinner: z
        .string({ required_error: "Toss winner is required" })
        .regex(objectIdRegex, { message: "Invalid toss winner ID format" }),

    tossDecision: z
        .nativeEnum(TOSS_DECISION, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Toss decision must be one of: ${Object.values(TOSS_DECISION).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        }),
});

export const completeMatchSchema = z.object({
    winner: z
        .string({ required_error: "Winner team ID is required" })
        .regex(objectIdRegex, { message: "Invalid winner ID format" }),

    result: z
        .string({ required_error: "Result is required" })
        .min(1, "Result description is required")
        .trim(),
});
