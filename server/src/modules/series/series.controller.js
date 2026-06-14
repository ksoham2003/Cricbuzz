import SeriesService from "./series.service.js";
import { createSeriesSchema, updateSeriesSchema } from "./series.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

class SeriesController {
    constructor() {
        this.seriesService = new SeriesService();
    }

    /**
     * POST /api/series
     * Creates a new series. Restricted to ADMIN and SUPER_ADMIN.
     */
    createSeriesController = asyncHandler(async (req, res) => {
        const validation = createSeriesSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        const result = await this.seriesService.createSeries(validation.data, req.user.id);

        return res
            .status(201)
            .json(new ApiResponse(201, { _id: result._id }, "Series created successfully"));
    });

    /**
     * GET /api/series
     * Returns a paginated, filterable list of series.
     */
    getSeriesController = asyncHandler(async (req, res) => {
        const { page, limit, status, search } = req.query;

        const result = await this.seriesService.fetchAllSeries({ page, limit, status, search });

        return res.status(200).json(
            new ApiResponse(200, {
                count: result.count,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                data: result.data,
            })
        );
    });

    /**
     * GET /api/series/:id
     * Returns a single series by ID.
     */
    getSeriesByIdController = asyncHandler(async (req, res) => {
        const series = await this.seriesService.fetchSeriesById(req.params.id);

        return res.status(200).json(new ApiResponse(200, { series }));
    });

    /**
     * PATCH /api/series/:id
     * Updates a series. Restricted to ADMIN and SUPER_ADMIN.
     */
    updateSeriesController = asyncHandler(async (req, res) => {
        const validation = updateSeriesSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(400, validation.error.issues[0].message, validation.error.issues);
        }

        if (Object.keys(validation.data).length === 0) {
            throw new ApiError(400, "No update fields provided");
        }

        const updated = await this.seriesService.updateSeries(req.params.id, validation.data);

        return res
            .status(200)
            .json(new ApiResponse(200, { series: updated }, "Series updated successfully"));
    });

    /**
     * DELETE /api/series/:id
     * Soft deletes a series. Restricted to ADMIN and SUPER_ADMIN.
     */
    deleteSeriesController = asyncHandler(async (req, res) => {
        await this.seriesService.removeSeries(req.params.id);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Series deleted successfully"));
    });
}

export default new SeriesController();
