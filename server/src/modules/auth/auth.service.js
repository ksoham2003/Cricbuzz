import AuthRepository from "./auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../../config/env.js";
import appConstant from "../../constant/app.constant.js";
import { ApiError } from "../../utils/ApiError.js";

export default class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }

    /**
     * Generate an access token + refresh token pair for a user.
     * @param {Object} user - The user document from the database.
     * @returns {{ accessToken: string, refreshToken: string }}
     */
    _generateTokens(user) {
        const payload = { id: user._id, email: user.email, role: user.role };

        const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
            expiresIn: appConstant.ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
            expiresIn: appConstant.REFRESH_TOKEN_EXPIRY,
        });

        return { accessToken, refreshToken };
    }

    /**
     * Hash the refresh token and persist it on the user document.
     * @param {string} userId
     * @param {string} refreshToken
     */
    async _saveRefreshToken(userId, refreshToken) {
        const hashedToken = await bcrypt.hash(refreshToken, appConstant.BCRYPT_SALT_ROUNDS);
        await this.authRepository.updateRefreshToken(userId, hashedToken);
    }

    async register(userData) {
        const { name, email, password, role } = userData;

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new ApiError(400, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, appConstant.BCRYPT_SALT_ROUNDS);

        const newUser = await this.authRepository.create({
            name,
            email,
            password: hashedPassword,
            role: role || "SCORER"
        });

        const { accessToken, refreshToken } = this._generateTokens(newUser);
        await this._saveRefreshToken(newUser._id, refreshToken);
        const { accessToken, refreshToken } = this._generateTokens(newUser);
        await this._saveRefreshToken(newUser._id, refreshToken);

        return {
            accessToken,
            refreshToken,
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        };
    }

    async login(email, password) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid email or password");
        }

        const { accessToken, refreshToken } = this._generateTokens(user);
        await this._saveRefreshToken(user._id, refreshToken);
        const { accessToken, refreshToken } = this._generateTokens(user);
        await this._saveRefreshToken(user._id, refreshToken);

        return {
            accessToken,
            refreshToken,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async findOrCreateUser(profile) {
        let user = await this.authRepository.findByEmail(profile.email);
        if (!user) {
            // For Google OAuth users, we can generate a random password to satisfy database schema
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, appConstant.BCRYPT_SALT_ROUNDS);
            
            user = await this.authRepository.create({
                name: profile.name || "Google User",
                email: profile.email,
                password: hashedPassword,
                role: "SCORER"
            });
        }

        const { accessToken, refreshToken } = this._generateTokens(user);
        await this._saveRefreshToken(user._id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    /**
     * Verify the incoming refresh token, rotate it, and issue a new token pair.
     * @param {string} incomingRefreshToken - The raw refresh token from the cookie.
     * @returns {{ accessToken: string, refreshToken: string, user: Object }}
     */
    async refreshAccessToken(incomingRefreshToken) {
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is required");
        }

        // Verify the refresh token signature & expiry
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        // Find the user and validate the stored hashed token
        const user = await this.authRepository.findById(decoded.id);
        if (!user || !user.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const isTokenValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
        if (!isTokenValid) {
            // Potential token reuse detected — clear all tokens for safety
            await this.authRepository.clearRefreshToken(user._id);
            throw new ApiError(401, "Refresh token reuse detected, please login again");
        }

        // Rotate: generate a new pair and persist the new refresh token hash
        const { accessToken, refreshToken } = this._generateTokens(user);
        await this._saveRefreshToken(user._id, refreshToken);

        return {
            accessToken,
            refreshToken,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    /**
     * Logout: clear the stored refresh token so it can no longer be used.
     * @param {string} userId
     */
    async logout(userId) {
        await this.authRepository.clearRefreshToken(userId);
    }

    /**
     * Logout: clear the stored refresh token so it can no longer be used.
     * @param {string} userId
     */
    async logout(userId) {
        await this.authRepository.clearRefreshToken(userId);
    }
}