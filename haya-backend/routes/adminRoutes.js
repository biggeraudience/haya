const express = require("express");
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile, 
  updateAdminProfile, 
  deleteAdmin,
  getAllAdmins,
  approveAdmin
} = require("../controllers/adminController");
const { protect, adminOnly, superadminOnly } = require("../middlewares/authMiddleware");

// Admin self-service routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile", protect, adminOnly, updateAdminProfile);
router.delete("/:id", protect, adminOnly, deleteAdmin);

// Superadmin-only routes
router.get("/all", protect, superadminOnly, getAllAdmins);
router.put("/approve/:id", protect, superadminOnly, approveAdmin);

module.exports = router;
