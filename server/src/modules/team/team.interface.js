/**
 * @typedef {Object} TeamInput
 * @property {string} name - Full team name e.g. "Mumbai Indians". Unique within a series.
 * @property {string} shortName - Abbreviation, max 5 chars, e.g. "MI". Auto-uppercased.
 * @property {string} [logo] - URL of team logo image
 * @property {string} [primaryColor] - Hex color code for team primary colour
 * @property {string} [secondaryColor] - Hex color code for team secondary colour
 * @property {string} [city] - City the team represents
 * @property {string} [coach] - Name of the head coach
 * @property {string} seriesId - ObjectId of the series this team belongs to
 */

/**
 * @typedef {Object} TeamUpdateInput
 * @property {string} [name]
 * @property {string} [shortName]
 * @property {string} [logo]
 * @property {string} [primaryColor]
 * @property {string} [secondaryColor]
 * @property {string} [city]
 * @property {string} [coach]
 * @property {string} [captain] - ObjectId ref to Player
 * @property {"ACTIVE" | "INACTIVE"} [status]
 * @property {number} [totalMatches]
 * @property {number} [wins]
 * @property {number} [losses]
 */

/**
 * @typedef {Object} TeamResponse
 * @property {string} _id
 * @property {string} name
 * @property {string} shortName
 * @property {string} [logo]
 * @property {string} [primaryColor]
 * @property {string} [secondaryColor]
 * @property {string} [city]
 * @property {string} [coach]
 * @property {string} [captain]
 * @property {string} seriesId
 * @property {number} totalMatches
 * @property {number} wins
 * @property {number} losses
 * @property {"ACTIVE" | "INACTIVE"} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} PaginatedTeamResponse
 * @property {boolean} success
 * @property {number} count - Total matching records
 * @property {number} page
 * @property {number} limit
 * @property {TeamResponse[]} data
 */

export const TeamInterface = {
    // Structural documentation for Team Module types
};
