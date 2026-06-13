import express from "express";
import CommentaryController from "./commentary.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();
const commentaryManagers = [ROLES.SUPER_ADMIN, ROLES.SCORER];

router.post(
    "/",
    authenticate,
    authorize(...commentaryManagers),
    CommentaryController.createCommentaryController
);

router.get(
    "/match/:matchId",
    CommentaryController.getCommentaryController
);

router.delete(
    "/:id",
    authenticate,
    authorize(...commentaryManagers),
    CommentaryController.deleteCommentaryController
);

export default router;
