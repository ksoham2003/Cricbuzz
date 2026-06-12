import AuthRepository from "./auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";

export default class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
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

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
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

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
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

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}