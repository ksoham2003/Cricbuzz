/**
 * @typedef {Object} UserInterface
 * @property {string} id - User ID
 * @property {string} name - User full name
 * @property {string} email - User email
 * @property {string} role - User role (SUPER_ADMIN, ADMIN, SCORER)
 * @property {string} picture - User profile picture URL
 * @property {boolean} isDeleted - Soft delete flag
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} UserInput
 * @property {string} name - User full name
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} [role] - User role (optional)
 */

export const userFields = ['id', 'name', 'email', 'role', 'picture', 'createdAt', 'updatedAt'];
export const userSensitiveFields = ['password', 'refreshToken'];
