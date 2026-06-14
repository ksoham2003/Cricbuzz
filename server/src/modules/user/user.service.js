import UserRepository from "../../repository/user.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Create a new user
     * @param {Object} data - User data
     * @param {string} data.name - User name
     * @param {string} data.email - User email
     * @param {string} data.password - User password
     * @param {string} [data.role] - User role
     */
    async createUser(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists");
        }

        const user = await this.userRepository.create(data);
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture,
        };
    }

    /**
     * Get all active users
     * @param {Object} query - Query parameters
     * @param {number} [query.page] - Page number
     * @param {number} [query.limit] - Records per page
     */
    async getAllUsers(query = {}) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
        const skip = (page - 1) * limit;

        const users = await this.userRepository.findAll(
            { isDeleted: false },
            { skip, limit, select: '-password -refreshToken' }
        );
        const total = await this.userRepository.countAll({ isDeleted: false });

        return {
            data: users,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     */
    async getUserById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError(404, "User not found");
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture,
            createdAt: user.createdAt,
        };
    }

    /**
     * Soft delete a user (only SUPER_ADMIN)
     * @param {string} userId - User ID
     */
    async deleteUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        await this.userRepository.softDelete(userId);
        return { message: "User deleted successfully" };
    }

    /**
     * Update user profile (limited fields)
     * @param {string} userId - User ID
     * @param {Object} data - Update data
     */
    async updateUserProfile(userId, data) {
        const user = await this.userRepository.findById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError(404, "User not found");
        }

        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.picture) updateData.picture = data.picture;

        const updated = await this.userRepository.update(userId, updateData);
        return {
            id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            picture: updated.picture,
        };
    }
}
