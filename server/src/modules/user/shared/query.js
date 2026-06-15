import { ApiError } from "../../../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Escape regex special characters for safe regex matching
 */
export const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Validate MongoDB ObjectId
 * @throws ApiError if invalid
 */
export const ensureId = (id, fieldName = "ID") => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError(400, `Invalid ${fieldName}`);
    }
    return id;
};

/**
 * Parse pagination parameters from query
 * @returns { page, limit, skip }
 */
export const pagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
};

/**
 * Calculate pagination metadata
 */
export const paginationMeta = (page, limit, total) => {
    return {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
    };
};
