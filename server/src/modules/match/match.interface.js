/**
 * @typedef {Object} PlayingXIParticipant
 * @property {string} player - Player ID
 * @property {boolean} isCaptain
 * @property {boolean} isWicketKeeper
 */

/**
 * @typedef {Object} MatchInput
 * @property {string} seriesId - Series ID
 * @property {string} [matchNumber] - match number (e.g. 1st Test)
 * @property {string} venue - venue name
 * @property {string} startTime - start date/time ISO string
 * @property {string} team1 - Team 1 ID
 * @property {string} team2 - Team 2 ID
 */

/**
 * @typedef {Object} TossInput
 * @property {string} tossWinner - Toss winner team ID
 * @property {"BAT" | "BOWL"} tossDecision - decision
 */

/**
 * @typedef {Object} CompleteMatchInput
 * @property {string} winner - Winner team ID
 * @property {string} result - Result description
 */

export const MatchInterface = {};
