import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

class AuthController {
    constructor() {
        this.authService = new AuthService();
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
            return res.status(201).json(result);
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
            return res.status(200).json(result);
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
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new AuthController();