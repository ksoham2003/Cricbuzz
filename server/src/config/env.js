import dotenv from "dotenv";
import z from "zod";
import appConstant from "../constant/app.constant.js";

dotenv.config(); // Trigger nodemon restart

const envSchema = z.object({
    PORT: z.coerce.number().default(appConstant.PORT),
    MONGO_URL: z.string().default(appConstant.MONGO_URL),
    NODE_ENV: z.string().default(appConstant.NODE_ENV),
    LOG_LEVEL: z.string().default(appConstant.LOG_LEVEL),
    CORS_ORIGIN: z.string().transform(value => value.split(',').map(url => url.trim())).default(appConstant.CORS_ORIGIN),
    RATELIMIT_WINDOWMS: z.coerce.number().default(appConstant.RATELIMIT_WINDOWMS),
    RATELIMIT: z.coerce.number().default(appConstant.RATELIMIT),
    GOOGLE_CLIENT_ID: z.string().default("development-google-client-id"),
    GOOGLE_CLIENT_SECRET: z.string().default("development-google-client-secret"),
    GOOGLE_CALLBACK_URL: z.string().url().default("http://localhost:3000/api/auth/google/callback"),
    ACCESS_TOKEN_SECRET: z.string().default("development-access-token-secret-change-me"),
    REFRESH_TOKEN_SECRET: z.string().default("development-refresh-token-secret-change-me"),
    REDIRECT_URL: z.string().url().default("http://localhost:5173/dashboard"),
    // JWT_SECRET_RESET_PASSWORD: z.string(),
    // JWT_SECRET_VERIFY_EMAIL: z.string(),
}).superRefine((config, ctx) => {
    if (config.NODE_ENV !== "production") return;

    const productionSecrets = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
    ];

    for (const key of productionSecrets) {
        if (!process.env[key]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [key],
                message: `${key} is required in production`,
            });
        }
    }
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(env.error.issues);
    process.exit(1);
}

export default env.data;
