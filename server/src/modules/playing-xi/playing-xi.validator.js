import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const playerXiItemSchema = z.object({
    player: z
        .string({ required_error: "Player ID is required" })
        .regex(objectIdRegex, { message: "Invalid player ID format" }),
    isCaptain: z.boolean().default(false),
    isWicketKeeper: z.boolean().default(false),
});

export const playingXiSchema = z.object({
    team1: z
        .array(playerXiItemSchema)
        .length(11, "Team 1 must have exactly 11 players selected"),
    team2: z
        .array(playerXiItemSchema)
        .length(11, "Team 2 must have exactly 11 players selected"),
});
