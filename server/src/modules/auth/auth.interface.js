/**
 * @typedef {Object} UserRegisterInput
 * @property {string} name - Min 3 characters
 * @property {string} email - Valid email address
 * @property {string} password - Min 6 characters
 * @property {"SUPER_ADMIN" | "ADMIN" | "SCORER"} [role] - User role
 */

/**
 * @typedef {Object} UserLoginInput
 * @property {string} email - Valid email address
 * @property {string} password - Required
 */

/**
 * @typedef {Object} JWTPayload
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} role - User role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT token
 * @property {Object} user
 * @property {string} user.id - User ID
 * @property {string} user.name - User name
 * @property {string} user.email - User email
 * @property {string} user.role - User role
 */

export const AuthInterface = {
    // Structural documentation for Auth Module types
};
