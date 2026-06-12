import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validator.js";
import env from "../../config/env.js";
import appConstant from "../../constant/app.constant.js";

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

    async register(req, res) {
        try {
            const validation = registerSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
            }

            const result = await this.authService.register(validation.data);

            this._setRefreshTokenCookie(res, result.refreshToken);

            return res.status(201).json({
                accessToken: result.accessToken,
                user: result.user
            });
        } catch (error) {
            if (error.message === "Email already registered") {
                return res.status(error.statusCode || 400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const validation = loginSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
            }

            const { email, password } = validation.data;
            const result = await this.authService.login(email, password);

            this._setRefreshTokenCookie(res, result.refreshToken);

            return res.status(200).json({
                accessToken: result.accessToken,
                user: result.user
            });
        } catch (error) {
            if (error.message === "Invalid email or password") {
                return res.status(error.statusCode || 401).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async googleAuth(req, res) {
        try {
            const profile = req.user;
            if (!profile || !profile.email) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            const result = await this.authService.findOrCreateUser(profile);

            this._setRefreshTokenCookie(res, result.refreshToken);

            return res.status(200).json({
                accessToken: result.accessToken,
                user: result.user
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async refresh(req, res) {
        try {
            const incomingRefreshToken = req.cookies[appConstant.REFRESH_TOKEN_COOKIE_NAME];

            const result = await this.authService.refreshAccessToken(incomingRefreshToken);

            this._setRefreshTokenCookie(res, result.refreshToken);

            return res.status(200).json({
                accessToken: result.accessToken,
                user: result.user
            });
        } catch (error) {
            // Clear the cookie on any refresh failure so stale tokens don't persist
            this._clearRefreshTokenCookie(res);

            return res.status(error.statusCode || 401).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            await this.authService.logout(req.user.id);

            this._clearRefreshTokenCookie(res);

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new AuthController();