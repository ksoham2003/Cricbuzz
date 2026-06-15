import UserRepository from "../../repository/user.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import bcrypt from "bcryptjs";
import appConstant from "../../constant/app.constant.js";

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

        const hashedPassword = await bcrypt.hash(data.password, appConstant.BCRYPT_SALT_ROUNDS);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            picture: user.picture,
        };
    }

    /**
     * Get all active users
     * @param {Object} query - Query parameters
     * @param {number} [query.page] - Page number
     * @param {number} [query.limit] - Records per page
     * @param {string} [query.role] - Filter by role
     * @param {string} [query.status] - Filter by status
     * @param {string} [query.search] - Search by name
     */
    async getAllUsers(query = {}) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };
        if (query.role) {
            filter.role = query.role;
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.search) {
            filter.name = { $regex: query.search, $options: "i" };
        }

        const users = await this.userRepository.findAll(
            filter,
            { skip, limit, select: '-password -refreshToken' }
        );
        const total = await this.userRepository.countAll(filter);

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
            status: user.status,
            picture: user.picture,
            createdAt: user.createdAt,
        };
    }

    /**
     * Soft delete a user (only SUPER_ADMIN)
     * @param {string} userId - User ID
     * @param {string} currentUserId - ID of the user performing the deletion
     */
    async deleteUser(userId, currentUserId) {
        if (userId === currentUserId) {
            throw new ApiError(400, "Cannot delete your own account");
        }

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
        if (data.role) updateData.role = data.role;
        if (data.status) updateData.status = data.status;

        const updated = await this.userRepository.update(userId, updateData);
        return {
            id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            status: updated.status,
            picture: updated.picture,
        };
    }
}
