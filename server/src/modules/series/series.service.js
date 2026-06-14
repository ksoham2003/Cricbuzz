import SeriesRepository from "./series.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export default class SeriesService {
    constructor() {
        this.seriesRepository = new SeriesRepository();
    }

    /**
     * Create a new series after validating uniqueness and date order.
     * @param {import("./series.interface.js").SeriesInput} data
     * @param {string} userId - ID of the authenticated admin creating the series
     */
    async createSeries(data, userId) {
        const { name, shortName, startDate, endDate } = data;

        // Duplicate name check
        const existingByName = await this.seriesRepository.findSeriesByName(name);
        if (existingByName) {
            throw new ApiError(400, "Series already exists");
        }

        // Duplicate shortName check
        const existingByShortName = await this.seriesRepository.findSeriesByShortName(shortName);
        if (existingByShortName) {
            throw new ApiError(400, "A series with this short name already exists");
        }

        // Date validation
        if (new Date(startDate) > new Date(endDate)) {
            throw new ApiError(400, "Invalid date range: Start date cannot be after end date");
        }

        const series = await this.seriesRepository.createSeries({
            ...data,
            createdBy: userId,
        });

        return { _id: series._id };
    }

    /**
     * Return a paginated list of series.
     * @param {{ page?: number, limit?: number, status?: string, search?: string }} query
     */
    async fetchAllSeries(query) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

        return await this.seriesRepository.getAllSeries({
            page,
            limit,
            status: query.status,
            search: query.search,
        });
    }

    /**
     * Fetch a single series by ID, throws 404 if not found.
     * @param {string} id
     */
    async fetchSeriesById(id) {
        const series = await this.seriesRepository.getSeriesById(id);
        if (!series) {
            throw new ApiError(404, "Series not found");
        }
        return series;
    }

    /**
     * Update a series. Validates date order if both dates are provided.
     * @param {string} id
     * @param {import("./series.interface.js").SeriesUpdateInput} data
     */
    async updateSeries(id, data) {
        const existing = await this.seriesRepository.getSeriesById(id);
        if (!existing) {
            throw new ApiError(404, "Series not found");
        }

        // Re-validate dates if either is being updated
        const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
        const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;

        if (startDate > endDate) {
            throw new ApiError(400, "Invalid date range: Start date cannot be after end date");
        }

        const updated = await this.seriesRepository.updateSeries(id, data);
        if (!updated) {
            throw new ApiError(404, "Series not found");
        }

        return updated;
    }

    /**
     * Soft delete a series. Throws 404 if not found.
     * @param {string} id
     */
    async removeSeries(id) {
        const existing = await this.seriesRepository.getSeriesById(id);
        if (!existing) {
            throw new ApiError(404, "Series not found");
        }

        await this.seriesRepository.deleteSeries(id);
    }
}
