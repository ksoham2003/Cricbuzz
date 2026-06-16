/**
 * Squad Interfaces
 * Type definitions for squad management
 */

/**
 * @typedef {Object} SquadInput
 * @property {string} seriesId - Series ID (ObjectId)
 * @property {string} teamId - Team ID (ObjectId)
 * @property {Array<string>} players - Array of player IDs (ObjectId)
 * @property {string} status - Squad status (ACTIVE, INACTIVE)
 */

/**
 * @typedef {Object} SquadResponse
 * @property {string} _id - Squad ID
 * @property {string} seriesId - Series ID
 * @property {string} teamId - Team ID
 * @property {Array<Object>} players - Array of player objects with details
 * @property {string} status - Squad status
 * @property {number} totalPlayers - Total players in squad
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} SquadPlayerInput
 * @property {string} playerId - Player ID to add/remove (ObjectId)
 */

/**
 * @typedef {Object} SquadStatusUpdate
 * @property {string} status - New status (ACTIVE, INACTIVE)
 */

/**
 * @typedef {Object} SquadListResponse
 * @property {number} count - Total squads
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {Array<SquadResponse>} data - Squad list
 */

export default {
    /**
     * Squad constraints and rules
     */
    Constraints: {
        minPlayers: 11,
        maxPlayers: 25,
        uniquenessScope: "per_series_per_team", // One squad per team per series
    },

    /**
     * Squad status values
     */
    Status: {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
    },

    /**
     * Squad workflow:
     * 1. Create squad for team in a series
     * 2. Add players to squad (11-25 players)
     * 3. Select final 11 for playing XI
     * 4. Use squad for match management
     */
    WorkflowSteps: [
        "Create squad for team",
        "Add eligible players",
        "Finalize squad roster",
        "Select playing XI",
        "Manage substitutions",
    ],

    /**
     * Access control for squad operations
     */
    AccessControl: {
        CREATE: ["SUPER_ADMIN", "ADMIN"],
        READ: ["SUPER_ADMIN", "ADMIN", "SCORER"],
        UPDATE: ["SUPER_ADMIN", "ADMIN"],
        DELETE: ["SUPER_ADMIN", "ADMIN"],
        ADD_PLAYER: ["SUPER_ADMIN", "ADMIN"],
        REMOVE_PLAYER: ["SUPER_ADMIN", "ADMIN"],
        UPDATE_STATUS: ["SUPER_ADMIN", "ADMIN"],
    },

    /**
     * Error codes for squad operations
     */
    ErrorCodes: {
        SQUAD_EXISTS: "SQUAD_EXISTS",
        SQUAD_NOT_FOUND: "SQUAD_NOT_FOUND",
        SERIES_NOT_FOUND: "SERIES_NOT_FOUND",
        TEAM_NOT_FOUND: "TEAM_NOT_FOUND",
        PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
        PLAYER_ALREADY_IN_SQUAD: "PLAYER_ALREADY_IN_SQUAD",
        PLAYER_NOT_IN_SQUAD: "PLAYER_NOT_IN_SQUAD",
        MIN_PLAYERS_REQUIRED: "MIN_PLAYERS_REQUIRED",
        MAX_PLAYERS_EXCEEDED: "MAX_PLAYERS_EXCEEDED",
        PLAYER_FROM_DIFFERENT_TEAM: "PLAYER_FROM_DIFFERENT_TEAM",
        INVALID_STATUS: "INVALID_STATUS",
    },
};
