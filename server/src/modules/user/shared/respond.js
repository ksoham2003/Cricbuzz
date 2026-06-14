import { ApiResponse } from "../../../utils/ApiResponse.js";

/**
 * Standard response wrapper for public API endpoints
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 * @param {string} message - Response message
 */
export const respond = (statusCode, data, message = "") => {
    return new ApiResponse(statusCode, data, message);
};

/**
 * Success response (200)
 */
export const respondSuccess = (data, message = "Success") => {
    return respond(200, data, message);
};

/**
 * Created response (201)
 */
export const respondCreated = (data, message = "Created") => {
    return respond(201, data, message);
};

/**
 * Paginated response wrapper
 */
export const respondPaginated = (data, pagination, message = "Success") => {
    return respond(200, {
        data,
        pagination,
    }, message);
};
