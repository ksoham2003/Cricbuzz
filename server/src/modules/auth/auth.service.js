import AuthRepository from "./auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import appConstant from "../../constant/app.constant.js";

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

        const accessToken = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: appConstant.ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
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
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.authRepository.updateRefreshToken(userId, hashedToken);
    }

    async register(userData) {
        const { name, email, password, role } = userData;

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error("Email already registered");
            error.statusCode = 400; // Or 409 Conflict
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.authRepository.create({
            name,
            email,
            password: hashedPassword,
            role: role || "SCORER"
        });

        const { accessToken, refreshToken } = this._generateTokens(newUser);
        await this._saveRefreshToken(newUser._id, refreshToken);

        return {
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
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
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

    async findOrCreateUser(profile) {
        let user = await this.authRepository.findByEmail(profile.email);
        if (!user) {
            // For Google OAuth users, we can generate a random password to satisfy database schema
            const randomPassword = Math.random().toString(36).substring(2, 15);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
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
            const error = new Error("Refresh token is required");
            error.statusCode = 401;
            throw error;
        }

        // Verify the refresh token signature & expiry
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
        } catch (err) {
            const error = new Error("Invalid or expired refresh token");
            error.statusCode = 401;
            throw error;
        }

        // Find the user and validate the stored hashed token
        const user = await this.authRepository.findById(decoded.id);
        if (!user || !user.refreshToken) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }

        const isTokenValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
        if (!isTokenValid) {
            // Potential token reuse detected — clear all tokens for safety
            await this.authRepository.clearRefreshToken(user._id);
            const error = new Error("Refresh token reuse detected, please login again");
            error.statusCode = 401;
            throw error;
        }

        // Rotate: generate a new pair and persist the new refresh token hash
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
     * Logout: clear the stored refresh token so it can no longer be used.
     * @param {string} userId
     */
    async logout(userId) {
        await this.authRepository.clearRefreshToken(userId);
    }
}