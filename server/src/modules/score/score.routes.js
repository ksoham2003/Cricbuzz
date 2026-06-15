import express from "express";
import ScoreController from "./score.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();

// Create score
router.post(
    "/",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => ScoreController.createScoreController(req, res, next)
);

// Update score
router.patch(
    "/:id",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => ScoreController.updateScoreController(req, res, next)
);

// Get scores for a match
router.get(
    "/match/:matchId",
    authenticate,
    authorize(ROLES.SUPER_ADMIN, ROLES.SCORER),
    (req, res, next) => ScoreController.fetchScoresController(req, res, next)
);

export default router;
