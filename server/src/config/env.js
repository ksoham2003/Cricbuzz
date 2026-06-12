import dotenv from "dotenv";
import z from "zod";
import appConstant from "../constant/app.constant.js";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(appConstant.PORT),
    MONGO_URL: z.string().default(appConstant.MONGO_URL),
    NODE_ENV: z.string().default(appConstant.NODE_ENV),
    LOG_LEVEL: z.string().default(appConstant.LOG_LEVEL),
    CORS_ORIGIN: z.string().transform(value => value.split(',').map(url => url.trim())).default(appConstant.CORS_ORIGIN),
    RATELIMIT_WINDOWMS: z.coerce.number().default(appConstant.RATELIMIT_WINDOWMS),
    RATELIMIT: z.coerce.number().default(appConstant.RATELIMIT),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    // JWT_SECRET_RESET_PASSWORD: z.string(),
    // JWT_SECRET_VERIFY_EMAIL: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(env.error.issues);
    process.exit(1);
}

export default env.data;
