import express from "express";
import TeamController from "./team.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/teams?page=1&limit=10&seriesId=...&status=ACTIVE&search=mumbai
router.get("/", (req, res, next) => TeamController.getTeamsController(req, res, next));

// GET /api/teams/:id
router.get("/:id", (req, res, next) => TeamController.getTeamByIdController(req, res, next));

// ─── Protected Routes (ADMIN / SUPER_ADMIN only) ─────────────────────────────

// POST /api/teams
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => TeamController.createTeamController(req, res, next)
);

// PATCH /api/teams/:id
router.patch(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => TeamController.updateTeamController(req, res, next)
);

// DELETE /api/teams/:id
router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => TeamController.deleteTeamController(req, res, next)
);

// POST /api/teams/:id/logo
router.post(
    "/:id/logo",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    upload.single("logo"),
    (req, res, next) => TeamController.uploadTeamLogoController(req, res, next)
);

export default router;
