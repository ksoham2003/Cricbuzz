import UserService from "./user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { createUserSchema, updateUserSchema, userIdSchema } from "./user.validator.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * GET /api/users
     * Get all active users (SUPER_ADMIN only)
     */
    getAllUsers = asyncHandler(async (req, res) => {
        const { page, limit } = req.query;
        const result = await this.userService.getAllUsers({ page, limit });

        res.status(200).json(
            new ApiResponse(200, result, "Users retrieved successfully")
        );
    });

    /**
     * GET /api/users/:id
     * Get user by ID (SUPER_ADMIN only)
     */
    getUserById = asyncHandler(async (req, res) => {
        const validation = userIdSchema.safeParse({ id: req.params.id });
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const user = await this.userService.getUserById(req.params.id);
        res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
    });

    /**
     * POST /api/users
     * Create new user (SUPER_ADMIN only)
     */
    createUser = asyncHandler(async (req, res) => {
        const validation = createUserSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const user = await this.userService.createUser(validation.data);
        res.status(201).json(new ApiResponse(201, user, "User created successfully"));
    });

    /**
     * DELETE /api/users/:id
     * Soft delete user (SUPER_ADMIN only)
     */
    deleteUser = asyncHandler(async (req, res) => {
        const validation = userIdSchema.safeParse({ id: req.params.id });
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const result = await this.userService.deleteUser(req.params.id);
        res.status(200).json(new ApiResponse(200, result, "User deleted successfully"));
    });

    /**
     * PATCH /api/users/:id
     * Update user profile (user can update own, SUPER_ADMIN can update any)
     */
    updateUserProfile = asyncHandler(async (req, res) => {
        const validation = userIdSchema.safeParse({ id: req.params.id });
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message);
        }

        const bodyValidation = updateUserSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            throw new ApiError(400, bodyValidation.error.issues[0].message);
        }

        const user = await this.userService.updateUserProfile(req.params.id, bodyValidation.data);
        res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
    });
}

export default UserController;
