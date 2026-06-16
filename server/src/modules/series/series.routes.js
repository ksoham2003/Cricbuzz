import express from "express";
import SeriesController from "./series.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/series?page=1&limit=10&status=ONGOING&search=IPL
router.get("/", (req, res, next) => SeriesController.getSeriesController(req, res, next));

// GET /api/series/:id
router.get("/:id", (req, res, next) => SeriesController.getSeriesByIdController(req, res, next));

// ─── Protected Routes (ADMIN / SUPER_ADMIN only) ─────────────────────────────

// POST /api/series
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => SeriesController.createSeriesController(req, res, next)
);

// PATCH /api/series/:id
router.patch(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => SeriesController.updateSeriesController(req, res, next)
);

// DELETE /api/series/:id
router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => SeriesController.deleteSeriesController(req, res, next)
);

export default router;
