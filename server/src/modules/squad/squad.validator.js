import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSquadSchema = z.object({
    seriesId: z.string().regex(objectIdRegex, "Invalid series ID"),
    teamId: z.string().regex(objectIdRegex, "Invalid team ID"),
});

export const addPlayerSchema = z.object({
    playerId: z.string().regex(objectIdRegex, "Invalid player ID"),
});

export const updateStatusSchema = z.object({
    status: z.string().refine(val => ["ACTIVE", "LOCKED"].includes(val), {
        message: "Status must be either ACTIVE or LOCKED",
    }),
});

export const squadIdSchema = z.object({
    id: z.string().regex(objectIdRegex, "Invalid squad ID"),
});
