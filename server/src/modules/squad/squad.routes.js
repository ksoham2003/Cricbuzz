import express from "express";
import squadController from "./squad.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/squads - Get all squads (optional filters)
router.get("/", squadController.getSquadsController);

// GET /api/squads/team/:teamId - Get squad by team ID
router.get("/team/:teamId", squadController.getSquadByTeamController);

// GET /api/squads/:id - Get squad by ID
router.get("/:id", squadController.getSquadController);

// ─── Protected Routes (ADMIN / SUPER_ADMIN only) ─────────────────────────────

// POST /api/squads - Create squad
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    squadController.createSquadController
);

// POST /api/squads/:id/players - Add player to squad
router.post(
    "/:id/players",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    squadController.addPlayerController
);

// DELETE /api/squads/:id/players/:playerId - Remove player from squad
router.delete(
    "/:id/players/:playerId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    squadController.removePlayerController
);

// PATCH /api/squads/:id/status - Update squad status
router.patch(
    "/:id/status",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    squadController.updateSquadStatusController
);

export default router;
