import dotenv from "dotenv";
import z from "zod";
import appConstant from "../constant/app.constant.js";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(appConstant.PORT),
    MONGO_URL: z.string().default(appConstant.MONGO_URL),
    NODE_ENV: z.string().default(appConstant.NODE_ENV),
    LOG_LEVEL: z.string().default(appConstant.LOG_LEVEL)
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(env.error.issues);
    process.exit(1);
}

export default env.data;
