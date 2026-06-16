import express from "express";
import playingXiController from "./playing-xi.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();

/**
 * Playing XI Routes
 * /api/playing-xi
 */

/**
 * POST /api/playing-xi/:matchId
 * Select playing XI for a match
 * Requires: ADMIN or SUPER_ADMIN
 */
router.post(
    "/:matchId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    playingXiController.selectPlayingXi
);

/**
 * GET /api/playing-xi/:matchId
 * Get complete playing XI for a match
 * Public endpoint
 */
router.get("/:matchId", playingXiController.getPlayingXi);

/**
 * GET /api/playing-xi/:matchId/team/:teamNumber
 * Get playing XI for a specific team
 * Public endpoint
 */
router.get("/:matchId/team/:teamNumber", playingXiController.getTeamPlayingXi);

export default router;
