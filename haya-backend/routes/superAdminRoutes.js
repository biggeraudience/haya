const express = require("express");
const router = express.Router();
const { registerSuperAdmin, loginSuperAdmin, getSuperAdminProfile, updateSuperAdminProfile,
 logoutSuperAdmin } = require("../controllers/superAdminController");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");

router.post("/register", registerSuperAdmin);
router.post("/login", loginSuperAdmin);
router.get("/profile", protect, superadminOnly, getSuperAdminProfile);
router.put("/profile", protect, superadminOnly, updateSuperAdminProfile);
router.post("/logout", protect, superadminOnly, logoutSuperAdmin); // NEW logout endpoint

module.exports = router;
