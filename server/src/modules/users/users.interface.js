/**
 * User Management Module Interfaces
 * Type definitions for SUPER_ADMIN user management operations
 */

/**
 * @typedef {Object} UserInput
 * @property {string} name - User full name
 * @property {string} email - User email (unique)
 * @property {string} password - User password (min 8 chars)
 * @property {string} role - User role (SUPER_ADMIN, ADMIN, SCORER)
 * @property {string} [status] - User status (ACTIVE, INACTIVE)
 * @property {string} [picture] - User profile picture URL
 */

/**
 * @typedef {Object} UserResponse
 * @property {string} id - User ID
 * @property {string} name - User full name
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {string} status - User status
 * @property {string} picture - User profile picture URL
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} UserListResponse
 * @property {Array<UserResponse>} data - User list
 * @property {number} total - Total users
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {number} pages - Total pages
 */

/**
 * @typedef {Object} UserUpdateInput
 * @property {string} [name] - User full name
 * @property {string} [role] - User role
 * @property {string} [status] - User status
 * @property {string} [picture] - User profile picture URL
 */

/**
 * @typedef {Object} UserQuery
 * @property {number} [page] - Page number (default: 1)
 * @property {number} [limit] - Records per page (default: 10)
 * @property {string} [role] - Filter by role
 * @property {string} [status] - Filter by status
 * @property {string} [search] - Search by name or email
 */

export default {
    /**
     * User roles and hierarchy
     */
    Roles: {
        SUPER_ADMIN: "SUPER_ADMIN",
        ADMIN: "ADMIN",
        SCORER: "SCORER",
    },

    /**
     * User status values
     */
    Status: {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
    },

    /**
     * User constraints
     */
    Constraints: {
        minPasswordLength: 8,
        uniqueField: "email",
        maxPageLimit: 100,
        defaultPageLimit: 10,
    },

    /**
     * SUPER_ADMIN user management workflow
     */
    WorkflowSteps: [
        "Create user with role assignment",
        "Activate/deactivate user account",
        "Update user details",
        "View user list with filters",
        "Delete user (soft delete)",
        "Search users by name or email",
    ],

    /**
     * Access control for user operations
     * Only SUPER_ADMIN can perform user management
     */
    AccessControl: {
        CREATE_USER: ["SUPER_ADMIN"],
        READ_USER: ["SUPER_ADMIN"],
        READ_ALL_USERS: ["SUPER_ADMIN"],
        UPDATE_USER: ["SUPER_ADMIN"],
        DELETE_USER: ["SUPER_ADMIN"],
        ASSIGN_ROLE: ["SUPER_ADMIN"],
        UPDATE_STATUS: ["SUPER_ADMIN"],
    },

    /**
     * Error codes for user operations
     */
    ErrorCodes: {
        USER_EXISTS: "USER_EXISTS",
        USER_NOT_FOUND: "USER_NOT_FOUND",
        INVALID_EMAIL: "INVALID_EMAIL",
        WEAK_PASSWORD: "WEAK_PASSWORD",
        INVALID_ROLE: "INVALID_ROLE",
        INVALID_STATUS: "INVALID_STATUS",
        EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE",
        CANNOT_DELETE_SUPER_ADMIN: "CANNOT_DELETE_SUPER_ADMIN",
    },

    /**
     * Sensitive fields that should never be returned to client
     */
    SensitiveFields: ["password", "refreshToken"],

    /**
     * Fields that can be filtered/searched
     */
    SearchableFields: ["name", "email"],
    FilterableFields: ["role", "status"],
};
