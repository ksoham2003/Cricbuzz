/**
 * Playing XI Interfaces
 * Type definitions for Playing XI selection
 */

/**
 * @typedef {Object} PlayingXIParticipant
 * @property {string} player - Player ID (ObjectId)
 * @property {boolean} isCaptain - Is this player the captain?
 * @property {boolean} isWicketKeeper - Is this player the wicket-keeper?
 */

/**
 * @typedef {Object} PlayingXIInput
 * @property {Array<PlayingXIParticipant>} team1 - Team 1 XI (exactly 11 players)
 * @property {Array<PlayingXIParticipant>} team2 - Team 2 XI (exactly 11 players)
 */

/**
 * @typedef {Object} PlayingXIResponse
 * @property {Array<PlayingXIParticipant>} team1 - Team 1 XI with player details
 * @property {Array<PlayingXIParticipant>} team2 - Team 2 XI with player details
 */

/**
 * @typedef {Object} PlayingXIValidationError
 * @property {string} message - Error message
 * @property {string} field - Field with error (team1, team2)
 * @property {string} code - Error code (DUPLICATE_PLAYER, NO_CAPTAIN, etc.)
 */

export default {
    /**
     * Validate Playing XI requirements:
     * - Exactly 11 players per team
     * - Exactly 1 captain per team
     * - Exactly 1 wicket-keeper per team
     * - All players must be in squad
     * - No duplicate players
     */
    PlayingXIValidationRules: {
        playersPerTeam: 11,
        captainRequired: 1,
        wicketKeeperRequired: 1,
        duplicatesAllowed: false,
        squadMembersOnly: true,
    },

    /**
     * Playing XI workflow:
     * 1. Match status must be TOSS_COMPLETED
     * 2. Both squads must exist for the series
     * 3. Validate XI for both teams
     * 4. Update match with selected XI
     * 5. Emit socket event
     */
    WorkflowSteps: [
        "Verify match exists",
        "Check match status is TOSS_COMPLETED",
        "Load squads for both teams",
        "Validate team 1 XI",
        "Validate team 2 XI",
        "Update match document",
        "Emit socket event",
        "Return updated match",
    ],

    /**
     * Error codes for Playing XI operations
     */
    ErrorCodes: {
        INVALID_XI_SIZE: "INVALID_XI_SIZE",
        DUPLICATE_PLAYER: "DUPLICATE_PLAYER",
        NO_CAPTAIN: "NO_CAPTAIN",
        MULTIPLE_CAPTAINS: "MULTIPLE_CAPTAINS",
        NO_WICKET_KEEPER: "NO_WICKET_KEEPER",
        MULTIPLE_WICKET_KEEPERS: "MULTIPLE_WICKET_KEEPERS",
        PLAYER_NOT_IN_SQUAD: "PLAYER_NOT_IN_SQUAD",
        INVALID_MATCH_STATUS: "INVALID_MATCH_STATUS",
        SQUAD_NOT_FOUND: "SQUAD_NOT_FOUND",
    },
};
