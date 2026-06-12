export default {
    PORT: 3000,
    MONGO_URL: "mongodb://localhost:27017/cricBuzz",
    NODE_ENV: "development",
    LOG_LEVEL: "info",
    RATELIMIT_WINDOWMS: 15 * 60 * 1000,
    RATELIMIT: 100,
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "7d",
    REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
    REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};