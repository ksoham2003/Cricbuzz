import mongoose from "mongoose";
import { z } from "zod";
import { COMMENTARY_TYPES } from "./commentary.model.js";

const objectIdSchema = z.string().refine(
    (value) => mongoose.isObjectIdOrHexString(value),
    { message: "Invalid id" }
);

export const createCommentarySchema = z.object({
    matchId: objectIdSchema,
    over: z.number()
        .int({ message: "Over must be an integer" })
        .min(0, { message: "Over cannot be negative" }),
    ball: z.number()
        .int({ message: "Invalid ball number" })
        .min(1, { message: "Invalid ball number" })
        .max(6, { message: "Invalid ball number" }),
    text: z.string()
        .trim()
        .min(1, { message: "Commentary text is required" })
        .max(1000, { message: "Commentary text cannot exceed 1000 characters" }),
    type: z.enum(Object.values(COMMENTARY_TYPES)).default(COMMENTARY_TYPES.NORMAL),
}).strict();

export const matchIdParamSchema = z.object({
    matchId: objectIdSchema,
});

export const commentaryIdParamSchema = z.object({
    id: objectIdSchema,
});

export const commentaryPaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
