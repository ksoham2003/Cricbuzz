import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validator.js";
import env from "../../config/env.js";
import appConstant from "../../constant/app.constant.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    /**
     * Helper to set the refresh token as an httpOnly cookie on the response.
     * @param {import("express").Response} res
     * @param {string} refreshToken
     */
    _setRefreshTokenCookie(res, refreshToken) {
        res.cookie(appConstant.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appConstant.REFRESH_TOKEN_COOKIE_MAX_AGE,
        });
    }

    /**
     * Helper to clear the refresh token cookie.
     * @param {import("express").Response} res
     */
    _clearRefreshTokenCookie(res) {
        res.clearCookie(appConstant.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }

    /**
     * Helper to set the refresh token as an httpOnly cookie on the response.
     * @param {import("express").Response} res
     * @param {string} refreshToken
     */
    _setRefreshTokenCookie(res, refreshToken) {
        res.cookie(appConstant.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appConstant.REFRESH_TOKEN_COOKIE_MAX_AGE,
        });
    }

    _setAccessTokenCookie(res, accessToken) {
        res.cookie(appConstant.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appConstant.ACCESS_TOKEN_COOKIE_MAX_AGE,
        });
    }

    /**
     * Helper to clear the refresh token cookie.
     * @param {import("express").Response} res
     */
    _clearRefreshTokenCookie(res) {
        res.clearCookie(appConstant.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }

    _clearAccessTokenCookie(res) {
        res.clearCookie(appConstant.ACCESS_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }

    register = asyncHandler(async (req, res) => {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        const result = await this.authService.register(validation.data);

        this._setRefreshTokenCookie(res, result.refreshToken);
        this._setAccessTokenCookie(res, result.accessToken);

        return res.status(201).json(new ApiResponse(201, { user: result.user }, "User registered successfully"));
    });

    login = asyncHandler(async (req, res) => {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        const { email, password } = validation.data;
        const result = await this.authService.login(email, password);

        this._setRefreshTokenCookie(res, result.refreshToken);
        this._setAccessTokenCookie(res, result.accessToken);

        return res.status(200).json(new ApiResponse(200, { user: result.user }, "Logged in successfully"));
    });

    googleAuth = asyncHandler(async (req, res) => {
        const profile = req.user;
        if (!profile || !profile.email) {
            throw new ApiError(401, "Unauthorized Google Profile");
        }
        const result = await this.authService.findOrCreateUser(profile);

        this._setRefreshTokenCookie(res, result.refreshToken);
        this._setAccessTokenCookie(res, result.accessToken);

        return res.status(200).json(new ApiResponse(200, { user: result.user }, "Google authenticated successfully"));
    });

    refresh = asyncHandler(async (req, res) => {
        try {
            const incomingRefreshToken = req.cookies[appConstant.REFRESH_TOKEN_COOKIE_NAME];
            const result = await this.authService.refreshAccessToken(incomingRefreshToken);

            this._setRefreshTokenCookie(res, result.refreshToken);
            this._setAccessTokenCookie(res, result.accessToken);

            return res.status(200).json(new ApiResponse(200, { user: result.user }, "Token refreshed successfully"));
        } catch (error) {
            // Clear the cookie on any refresh failure so stale tokens don't persist
            this._clearRefreshTokenCookie(res);
            this._clearAccessTokenCookie(res);
            throw error;
        }
    });

    logout = asyncHandler(async (req, res) => {
        await this.authService.logout(req.user.id);

        this._clearRefreshTokenCookie(res);
        this._clearAccessTokenCookie(res);

        return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
    });
}

export default new AuthController();