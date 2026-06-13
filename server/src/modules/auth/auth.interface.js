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
 * @typedef {Object} TokenPair
 * @property {string} accessToken - Short-lived JWT (15 min) signed with ACCESS_TOKEN_SECRET
 * @property {string} refreshToken - Long-lived JWT (7 days) signed with REFRESH_TOKEN_SECRET
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken - Short-lived JWT access token (returned in JSON body)
 * @property {string} accessToken - Short-lived JWT access token (returned in JSON body)
 * @property {Object} user
 * @property {string} user.id - User ID
 * @property {string} user.name - User name
 * @property {string} user.email - User email
 * @property {string} user.role - User role
 *
 * Note: The refresh token is NOT included in the JSON response.
 * It is set as an httpOnly secure cookie named "refreshToken".
 *
 * Note: The refresh token is NOT included in the JSON response.
 * It is set as an httpOnly secure cookie named "refreshToken".
 */

export const AuthInterface = {
    // Structural documentation for Auth Module types
};
