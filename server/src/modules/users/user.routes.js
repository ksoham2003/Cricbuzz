import express from "express";
import UserController from "./user.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constant/model.constant.js";

const router = express.Router();
const userController = new UserController();

// All routes require authentication and SUPER_ADMIN role
router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN));

// GET /api/users - Get all users
router.get("/", (req, res, next) =>
    userController.getAllUsers(req, res, next)
);

// GET /api/users/:id - Get user by ID
router.get("/:id", (req, res, next) =>
    userController.getUserById(req, res, next)
);

// POST /api/users - Create new user
router.post("/", (req, res, next) =>
    userController.createUser(req, res, next)
);

// PATCH /api/users/:id - Update user profile
router.patch("/:id", (req, res, next) =>
    userController.updateUserProfile(req, res, next)
);

// DELETE /api/users/:id - Soft delete user
router.delete("/:id", (req, res, next) =>
    userController.deleteUser(req, res, next)
);

export default router;
