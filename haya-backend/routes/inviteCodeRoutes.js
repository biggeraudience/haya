const express = require("express");
const router = express.Router();
const { 
  createInviteCode, 
  getInviteCodes, 
  updateInviteCodeWithAdmin, 
  deleteInviteCode, 
  cleanupExpiredCodes 
} = require("../controllers/inviteCodeController");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");

// Only superadmins can manage invite codes
router.post("/", protect, superadminOnly, createInviteCode);
router.get("/", protect, superadminOnly, getInviteCodes);
router.put("/:id", protect, superadminOnly, updateInviteCodeWithAdmin);
router.delete("/:id", protect, superadminOnly, deleteInviteCode);
router.delete("/", protect, superadminOnly, cleanupExpiredCodes); // Optional cleanup route

module.exports = router;
