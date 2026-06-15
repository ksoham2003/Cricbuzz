/**
 * @typedef {Object} PlayerStats
 * @property {number} matchesPlayed - Total matches played
 * @property {number} runs - Total runs scored
 * @property {number} wickets - Total wickets taken
 * @property {number} catches - Total catches taken
 */

/**
 * @typedef {Object} PlayerInput
 * @property {string} firstName - Player's first name. Required.
 * @property {string} lastName - Player's last name. Required.
 * @property {number} age - Player's age. Must be >= 10. Required.
 * @property {"BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER"} role - Playing role. Required.
 * @property {string} teamId - ObjectId of the team this player belongs to. Required.
 * @property {number} [jerseyNumber] - Unique jersey number within the team. Optional.
 * @property {"RIGHT_HAND_BAT" | "LEFT_HAND_BAT"} [battingStyle] - Batting style. Optional.
 * @property {"RIGHT_ARM_FAST" | "LEFT_ARM_FAST" | "RIGHT_ARM_SPIN" | "LEFT_ARM_SPIN"} [bowlingStyle] - Bowling style. Optional.
 * @property {string} [nationality] - Nationality. Optional.
 * @property {string} [profileImage] - Profile image file path or URL. Optional.
 */

/**
 * @typedef {Object} PlayerUpdateInput
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {number} [age]
 * @property {"BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER"} [role]
 * @property {string} [teamId]
 * @property {number} [jerseyNumber]
 * @property {"RIGHT_HAND_BAT" | "LEFT_HAND_BAT"} [battingStyle]
 * @property {"RIGHT_ARM_FAST" | "LEFT_ARM_FAST" | "RIGHT_ARM_SPIN" | "LEFT_ARM_SPIN"} [bowlingStyle]
 * @property {string} [nationality]
 * @property {string} [profileImage]
 * @property {"ACTIVE" | "INJURED" | "RETIRED"} [status]
 * @property {number} [matchesPlayed]
 * @property {number} [runs]
 * @property {number} [wickets]
 * @property {number} [catches]
 */

/**
 * @typedef {Object} PlayerResponse
 * @property {string} _id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 * @property {string} [profileImage]
 * @property {number} [jerseyNumber]
 * @property {number} age
 * @property {"RIGHT_HAND_BAT" | "LEFT_HAND_BAT"} [battingStyle]
 * @property {"RIGHT_ARM_FAST" | "LEFT_ARM_FAST" | "RIGHT_ARM_SPIN" | "LEFT_ARM_SPIN"} [bowlingStyle]
 * @property {"BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER"} role
 * @property {string} nationality
 * @property {string} teamId
 * @property {number} matchesPlayed
 * @property {number} runs
 * @property {number} wickets
 * @property {number} catches
 * @property {"ACTIVE" | "INJURED" | "RETIRED"} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} PaginatedPlayerResponse
 * @property {boolean} success
 * @property {number} count
 * @property {number} page
 * @property {number} limit
 * @property {PlayerResponse[]} data
 */

export const PlayerInterface = {
    // Structural documentation for Player Module types
};
