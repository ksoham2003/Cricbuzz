import Team from "./team.model.js";

export default class TeamRepository {
    /**
     * Create a new team document.
     * @param {Object} data
     */
    async createTeam(data) {
        return await Team.create(data);
    }

    /**
     * Find a team by its MongoDB _id, excluding soft-deleted.
     * @param {string} id
     */
    async findTeamById(id) {
        return await Team.findById(id).lean();
    }

    /**
     * Paginated list with optional filters: seriesId, status, search.
     * @param {{ page: number, limit: number, seriesId?: string, status?: string, search?: string }} options
     * @returns {Promise<{ data: Object[], count: number }>}
     */
    async findAllTeams({ page = 1, limit = 10, seriesId, status, search } = {}) {
        const filter = {};

        if (seriesId) {
            filter.seriesId = seriesId;
        }

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, count] = await Promise.all([
            Team.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Team.countDocuments(filter),
        ]);

        return { data, count };
    }

    /**
     * Update a team by ID and return the updated document.
     * @param {string} id
     * @param {Object} updateData
     */
    async updateTeam(id, updateData) {
        return await Team.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    }

    /**
     * Soft delete — sets isDeleted to true.
     * @param {string} id
     */
    async deleteTeam(id) {
        return await Team.findByIdAndUpdate(
            id,
            { isDeleted: true, status: "INACTIVE" },
            { new: true }
        ).lean();
    }

    /**
     * Find a team by name within a specific series (case-insensitive).
     * Used for duplicate checks on create.
     * @param {string} name
     * @param {string} seriesId
     */
    async findTeamByName(name, seriesId) {
        return await Team.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            seriesId,
        }).lean();
    }
}
