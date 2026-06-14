/**
 * @typedef {Object} SeriesInput
 * @property {string} name - Full series name (e.g. "Indian Premier League 2026"). Must be unique.
 * @property {string} shortName - Short identifier (e.g. "IPL2026"). Must be unique.
 * @property {string} [description] - Optional description
 * @property {"T10" | "T20" | "ODI" | "TEST"} format - Match format
 * @property {string | Date} startDate - Series start date
 * @property {string | Date} endDate - Series end date. Must be >= startDate.
 */

/**
 * @typedef {Object} SeriesUpdateInput
 * @property {string} [name]
 * @property {string} [shortName]
 * @property {string} [description]
 * @property {"T10" | "T20" | "ODI" | "TEST"} [format]
 * @property {string | Date} [startDate]
 * @property {string | Date} [endDate]
 * @property {"UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"} [status]
 * @property {number} [totalTeams]
 */

/**
 * @typedef {Object} SeriesResponse
 * @property {string} _id
 * @property {string} name
 * @property {string} shortName
 * @property {string} [description]
 * @property {"T10" | "T20" | "ODI" | "TEST"} format
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {number} totalTeams
 * @property {"UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"} status
 * @property {string} createdBy
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} PaginatedSeriesResponse
 * @property {boolean} success
 * @property {number} count - Total matching records
 * @property {number} page - Current page number
 * @property {number} limit - Records per page
 * @property {SeriesResponse[]} data
 */

export const SeriesInterface = {
    // Structural documentation for Series Module types
};
