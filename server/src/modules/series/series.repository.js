import Series from "./series.model.js";

export default class SeriesRepository {
    /**
     * Create a new series document.
     * @param {Object} data
     * @returns {Promise<import("mongoose").Document>}
     */
    async createSeries(data) {
        return await Series.create(data);
    }

    /**
     * Find a series by its MongoDB _id, excluding soft-deleted.
     * @param {string} id
     */
    async getSeriesById(id) {
        return await Series.findById(id).lean();
    }

    /**
     * Paginated list with optional status filter and name search.
     * @param {{ page: number, limit: number, status?: string, search?: string }} options
     * @returns {Promise<{ data: Object[], count: number }>}
     */
    async getAllSeries({ page = 1, limit = 10, status, search } = {}) {
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const [data, count] = await Promise.all([
            Series.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Series.countDocuments(filter),
        ]);

        return { data, count };
    }

    /**
     * Update a series by ID and return the updated document.
     * @param {string} id
     * @param {Object} updateData
     */
    async updateSeries(id, updateData) {
        return await Series.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    }

    /**
     * Soft delete — sets isDeleted to true.
     * @param {string} id
     */
    async deleteSeries(id) {
        return await Series.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).lean();
    }

    /**
     * Find a series by exact name (case-insensitive) for duplicate checks.
     * @param {string} name
     */
    async findSeriesByName(name) {
        return await Series.findOne({ name: { $regex: `^${name}$`, $options: "i" } }).lean();
    }

    /**
     * Find a series by exact shortName (case-insensitive) for duplicate checks.
     * @param {string} shortName
     */
    async findSeriesByShortName(shortName) {
        return await Series.findOne({ shortName: { $regex: `^${shortName}$`, $options: "i" } }).lean();
    }
}
