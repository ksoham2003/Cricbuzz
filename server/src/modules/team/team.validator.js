import { z } from "zod";
import { TEAM_STATUS } from "../../constant/model.constant.js";

export const createTeamSchema = z.object({
    name: z
        .string({ required_error: "Team name is required" })
        .min(2, { message: "Team name must be at least 2 characters long" })
        .trim(),

    shortName: z
        .string({ required_error: "Short name is required" })
        .min(2, { message: "Short name must be at least 2 characters" })
        .max(5, { message: "Short name must not exceed 5 characters" })
        .trim(),

    logo: z
        .string()
        .url({ message: "Logo must be a valid URL" })
        .optional(),

    primaryColor: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            message: "Primary color must be a valid hex color (e.g. #FF5733)",
        })
        .optional(),

    secondaryColor: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            message: "Secondary color must be a valid hex color (e.g. #FFFFFF)",
        })
        .optional(),

    city: z
        .string({ required_error: "City is required" })
        .min(2, { message: "City must be at least 2 characters" })
        .trim(),

    coach: z
        .string()
        .trim()
        .optional(),

    seriesId: z
        .string({ required_error: "Series ID is required" })
        .regex(/^[a-fA-F0-9]{24}$/, { message: "Series ID must be a valid ObjectId" }),
});

export const updateTeamSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Team name must be at least 2 characters long" })
        .trim()
        .optional(),

    shortName: z
        .string()
        .min(2, { message: "Short name must be at least 2 characters" })
        .max(5, { message: "Short name must not exceed 5 characters" })
        .trim()
        .optional(),

    logo: z
        .string()
        .url({ message: "Logo must be a valid URL" })
        .optional(),

    primaryColor: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            message: "Primary color must be a valid hex color",
        })
        .optional(),

    secondaryColor: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            message: "Secondary color must be a valid hex color",
        })
        .optional(),

    city: z
        .string()
        .min(2)
        .trim()
        .optional(),

    coach: z
        .string()
        .trim()
        .optional(),

    captain: z
        .string()
        .regex(/^[a-fA-F0-9]{24}$/, { message: "Captain must be a valid ObjectId" })
        .optional(),

    status: z
        .nativeEnum(TEAM_STATUS, {
            invalid_type_error: `Status must be one of: ${Object.values(TEAM_STATUS).join(", ")}`,
        })
        .optional(),

    totalMatches: z.number().int().min(0).optional(),
    wins: z.number().int().min(0).optional(),
    losses: z.number().int().min(0).optional(),
});
