import z from "zod";
import { ROLES } from "../../constant/model.constant.js";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(Object.values(ROLES)).optional().default(ROLES.SCORER),
});

export const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
    picture: z.string().url("Invalid URL").optional(),
}).strict();

export const userIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});
