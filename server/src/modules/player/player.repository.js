import Player from "./player.model.js";

export default class PlayerRepository {
    /**
     * Create a new player.
     * @param {Object} data
     */
    async createPlayer(data) {
        return await Player.create(data);
    }

    /**
     * Find player by ID, excluding soft deleted.
     * @param {string} id
     */
    async findPlayerById(id) {
        return await Player.findById(id).lean();
    }

    /**
     * Find players with filters, search, and pagination.
     * @param {{ page: number, limit: number, teamId?: string, role?: string, status?: string, search?: string }} options
     */
    async findPlayers({ page = 1, limit = 10, teamId, role, status, search } = {}) {
        const filter = {};

        if (teamId) {
            filter.teamId = teamId;
        }

        if (role) {
            filter.role = role;
        }

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { fullName: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, count] = await Promise.all([
            Player.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Player.countDocuments(filter),
        ]);

        return { data, count };
    }

    /**
     * Update player by ID.
     * @param {string} id
     * @param {Object} updateData
     */
    async updatePlayer(id, updateData) {
        return await Player.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    }

    /**
     * Soft delete player.
     * @param {string} id
     */
    async deletePlayer(id) {
        return await Player.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        ).lean();
    }

    /**
     * Check if a jersey number is already taken in a specific team.
     * @param {string} teamId
     * @param {number} jerseyNumber
     * @param {string} [excludePlayerId]
     */
    async findPlayerByJersey(teamId, jerseyNumber, excludePlayerId = null) {
        const filter = {
            teamId,
            jerseyNumber,
            isDeleted: false,
        };

        if (excludePlayerId) {
            filter._id = { $ne: excludePlayerId };
        }

        return await Player.findOne(filter).lean();
    }
}
