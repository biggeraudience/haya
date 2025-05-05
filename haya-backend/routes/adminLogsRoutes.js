const express = require("express");
const router = express.Router();
const { getAdminActivityLogs } = require("../controllers/adminLogsController");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");

// Only superadmins can view admin activity logs
router.get("/:id", protect, superadminOnly, getAdminActivityLogs);

module.exports = router;
