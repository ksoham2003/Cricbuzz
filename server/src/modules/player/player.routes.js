import express from "express";
import PlayerController from "./player.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/players?page=1&limit=10&teamId=...&role=...&status=...&search=...
router.get("/", (req, res, next) => PlayerController.getPlayersController(req, res, next));

// GET /api/players/:id
router.get("/:id", (req, res, next) => PlayerController.getPlayerController(req, res, next));

// ─── Protected Routes (ADMIN / SUPER_ADMIN only) ─────────────────────────────

// POST /api/players
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => PlayerController.createPlayerController(req, res, next)
);

// PATCH /api/players/:id
router.patch(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => PlayerController.updatePlayerController(req, res, next)
);

// DELETE /api/players/:id
router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => PlayerController.deletePlayerController(req, res, next)
);

// POST /api/players/:id/image
router.post(
    "/:id/image",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    upload.single("image"),
    (req, res, next) => PlayerController.uploadPlayerImageController(req, res, next)
);

export default router;
