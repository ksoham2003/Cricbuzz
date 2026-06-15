import { z } from "zod";
import { BATTING_STYLE, BOWLING_STYLE, PLAYER_ROLE, PLAYER_STATUS } from "../../constant/model.constant.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const createPlayerSchema = z.object({
    firstName: z
        .string({ required_error: "First name is required" })
        .min(1, "First name is required")
        .trim(),

    lastName: z
        .string({ required_error: "Last name is required" })
        .min(1, "Last name is required")
        .trim(),

    age: z
        .number({ required_error: "Age is required" })
        .int("Age must be an integer")
        .min(10, "Invalid player age"),

    role: z
        .nativeEnum(PLAYER_ROLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Role must be one of: ${Object.values(PLAYER_ROLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        }),

    teamId: z
        .string({ required_error: "Team ID is required" })
        .regex(objectIdRegex, { message: "Team ID must be a valid ObjectId" }),

    jerseyNumber: z
        .number()
        .int("Jersey number must be an integer")
        .min(0, "Jersey number cannot be negative")
        .optional()
        .nullable(),

    battingStyle: z
        .nativeEnum(BATTING_STYLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Batting style must be one of: ${Object.values(BATTING_STYLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional()
        .nullable(),

    bowlingStyle: z
        .nativeEnum(BOWLING_STYLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Bowling style must be one of: ${Object.values(BOWLING_STYLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional()
        .nullable(),

    nationality: z
        .string()
        .trim()
        .optional()
        .nullable(),

    profileImage: z
        .string()
        .trim()
        .optional()
        .nullable(),
});

export const updatePlayerSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name cannot be empty")
        .trim()
        .optional(),

    lastName: z
        .string()
        .min(1, "Last name cannot be empty")
        .trim()
        .optional(),

    age: z
        .number()
        .int("Age must be an integer")
        .min(10, "Invalid player age")
        .optional(),

    role: z
        .nativeEnum(PLAYER_ROLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Role must be one of: ${Object.values(PLAYER_ROLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional(),

    teamId: z
        .string()
        .regex(objectIdRegex, { message: "Team ID must be a valid ObjectId" })
        .optional(),

    jerseyNumber: z
        .number()
        .int("Jersey number must be an integer")
        .min(0, "Jersey number cannot be negative")
        .optional()
        .nullable(),

    battingStyle: z
        .nativeEnum(BATTING_STYLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Batting style must be one of: ${Object.values(BATTING_STYLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional()
        .nullable(),

    bowlingStyle: z
        .nativeEnum(BOWLING_STYLE, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Bowling style must be one of: ${Object.values(BOWLING_STYLE).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional()
        .nullable(),

    nationality: z
        .string()
        .trim()
        .optional()
        .nullable(),

    profileImage: z
        .string()
        .trim()
        .optional()
        .nullable(),

    status: z
        .nativeEnum(PLAYER_STATUS, {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: `Status must be one of: ${Object.values(PLAYER_STATUS).join(", ")}` };
                }
                return { message: ctx.defaultError };
            }
        })
        .optional(),

    matchesPlayed: z
        .number()
        .int()
        .min(0, "Matches played cannot be negative")
        .optional(),

    runs: z
        .number()
        .int()
        .min(0, "Runs cannot be negative")
        .optional(),

    wickets: z
        .number()
        .int()
        .min(0, "Wickets cannot be negative")
        .optional(),

    catches: z
        .number()
        .int()
        .min(0, "Catches cannot be negative")
        .optional(),
});
