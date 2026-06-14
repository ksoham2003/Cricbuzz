import logger from "../../../config/logger.js";

const cache = new Map();

/**
 * Response cache middleware with TTL
 * @param {number} ttl - Time to live in seconds
 */
export const responseCache = (ttl = 60) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const key = req.originalUrl || `${req.baseUrl}${req.url}`;
        
        // Check if cached response exists and hasn't expired
        if (cache.has(key)) {
            const cached = cache.get(key);
            if (Date.now() < cached.expiresAt) {
                logger.debug({ cacheKey: key, ttl }, "Cache hit");
                return res.status(cached.status).json(cached.data);
            } else {
                // Remove expired cache
                cache.delete(key);
            }
        }

        // Override res.json to cache successful responses
        const originalJson = res.json.bind(res);
        res.json = function (data) {
            if (res.statusCode < 400) {
                cache.set(key, {
                    status: res.statusCode,
                    data,
                    expiresAt: Date.now() + ttl * 1000,
                });
                logger.debug({ cacheKey: key, ttl }, "Response cached");
            }
            return originalJson(data);
        };

        next();
    };
};

/**
 * Clear all cached responses
 */
export const clearCache = () => {
    cache.clear();
    logger.info("All caches cleared");
};

/**
 * Clear specific cache by key pattern
 */
export const clearCacheByPattern = (pattern) => {
    let cleared = 0;
    for (const key of cache.keys()) {
        if (key.includes(pattern)) {
            cache.delete(key);
            cleared++;
        }
    }
    logger.info({ pattern, cleared }, "Cache cleared by pattern");
    return cleared;
};
