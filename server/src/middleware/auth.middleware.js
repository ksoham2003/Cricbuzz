import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import appConstant from "../constant/app.constant.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const cookieToken = req.cookies?.[appConstant.ACCESS_TOKEN_COOKIE_NAME];

        const token = cookieToken || bearerToken;
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            next(new ApiError(401, "Token expired"));
        } else if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(401, "Unauthorized: Invalid token"));
        }
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            next(new ApiError(403, "Forbidden: Insufficient privileges"));
        } else {
            next();
        }
    };
};
