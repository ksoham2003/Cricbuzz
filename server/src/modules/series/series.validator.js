import { z } from "zod";
import { SERIES_FORMAT, SERIES_STATUS } from "../../constant/model.constant.js";

export const createSeriesSchema = z.object({
    name: z
        .string({ required_error: "Series name is required" })
        .min(3, { message: "Series name must be at least 3 characters long" })
        .trim(),

    shortName: z
        .string({ required_error: "Short name is required" })
        .min(2, { message: "Short name must be at least 2 characters long" })
        .max(20, { message: "Short name must not exceed 20 characters" })
        .trim(),

    description: z
        .string()
        .trim()
        .optional(),

    format: z.nativeEnum(SERIES_FORMAT, {
        required_error: "Format is required",
        invalid_type_error: `Format must be one of: ${Object.values(SERIES_FORMAT).join(", ")}`,
    }),

    startDate: z.coerce.date({
        required_error: "Start date is required",
        invalid_type_error: "Start date must be a valid date",
    }),

    endDate: z.coerce.date({
        required_error: "End date is required",
        invalid_type_error: "End date must be a valid date",
    }),
});

export const updateSeriesSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Series name must be at least 3 characters long" })
        .trim()
        .optional(),

    shortName: z
        .string()
        .min(2, { message: "Short name must be at least 2 characters long" })
        .max(20, { message: "Short name must not exceed 20 characters" })
        .trim()
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    format: z
        .nativeEnum(SERIES_FORMAT, {
            invalid_type_error: `Format must be one of: ${Object.values(SERIES_FORMAT).join(", ")}`,
        })
        .optional(),

    startDate: z.coerce.date({ invalid_type_error: "Start date must be a valid date" }).optional(),

    endDate: z.coerce.date({ invalid_type_error: "End date must be a valid date" }).optional(),

    status: z
        .nativeEnum(SERIES_STATUS, {
            invalid_type_error: `Status must be one of: ${Object.values(SERIES_STATUS).join(", ")}`,
        })
        .optional(),

    totalTeams: z
        .number({ invalid_type_error: "Total teams must be a number" })
        .int()
        .min(0)
        .optional(),
});
