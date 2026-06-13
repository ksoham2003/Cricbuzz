/**
 * @typedef {"NORMAL" | "FOUR" | "SIX" | "WICKET" | "MILESTONE"} CommentaryType
 */

/**
 * @typedef {Object} CommentaryInput
 * @property {string} matchId
 * @property {number} over
 * @property {number} ball
 * @property {string} text
 * @property {CommentaryType} [type]
 */

/**
 * @typedef {Object} CommentaryPagination
 * @property {number} page
 * @property {number} limit
 */

export const CommentaryInterface = {};
