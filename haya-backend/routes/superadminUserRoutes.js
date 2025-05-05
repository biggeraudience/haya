// routes/superadminUserRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUsersForSuperadmin } = require("../controllers/superadminUserController");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");

// GET /api/superadmin/users - returns all registered users (regular users)
router.get("/", protect, superadminOnly, getAllUsersForSuperadmin);

module.exports = router;
