const express = require("express");
const { body } = require("express-validator");
const { getAllUsers, getProfile, updateProfile } = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * @openapi
 * /api/users/all:
 *   get:
 *     tags: [Users]
 *     summary: Get all registered users (admin only or internal service call)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
router.get("/all", requireAdmin, getAllUsers);

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticate, getProfile);

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */
router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
    body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
  ],
  validate,
  updateProfile
);

module.exports = router;
