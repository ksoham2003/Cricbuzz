import express from "express";
import MatchController from "./match.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();

// Get list of matches
router.get(
    "/",
    authenticate,
    (req, res, next) => MatchController.getMatchesController(req, res, next)
);

// Get single match
router.get(
    "/:id",
    authenticate,
    (req, res, next) => MatchController.getMatchController(req, res, next)
);

// Create match
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => MatchController.createMatchController(req, res, next)
);

// Update match details
router.patch(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => MatchController.updateMatchController(req, res, next)
);

// Delete match (soft delete)
router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    (req, res, next) => MatchController.deleteMatchController(req, res, next)
);

// Conduct toss
router.patch(
    "/:id/toss",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => MatchController.recordTossController(req, res, next)
);

// Select playing XI
router.post(
    "/:id/playing-xi",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => MatchController.selectPlayingXiController(req, res, next)
);

// Start match
router.patch(
    "/:id/start",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => MatchController.startMatchController(req, res, next)
);

// Innings break
router.patch(
    "/:id/innings-break",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => MatchController.inningsBreakController(req, res, next)
);

// Complete match
router.patch(
    "/:id/complete",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => MatchController.completeMatchController(req, res, next)
);

export default router;
