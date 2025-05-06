const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  refreshToken,
  getUserAddress,
  updateUserAddress,// ../haya-backend/routes/profileRoutes.js

const express = require("express");
// REMOVE this line that imports the middleware factory directly
// const { uploadPhoto } = require("../middlewares/profileMulter");

// Export a function that ACCEPTS the configured uploadPhoto middleware instance
export default (uploadPhoto) => { // Accept uploadPhoto as an argument
  const router = express.Router();

  const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    refreshToken,
    getUserAddress,
    updateUserAddress,
    deleteUserAddress,
    updateUserCards,
    getAllUsers,
    deleteAllUsers,
    uploadProfilePhotoController,
  } = require("../controllers/profileController");
  const { protect, autoGenerateToken, adminOnly } = require("../middlewares/authMiddleware");


  // Authentication routes
  router.post("/auth/register", registerUser);
  router.post("/auth/login", loginUser);
  router.post("/auth/logout", logoutUser);
  router.post("/auth/refresh-token", refreshToken);

  // User profile routes
  router.get("/auth/profile", protect, autoGenerateToken, getUserProfile);
  router.put("/auth/profile", protect, autoGenerateToken, updateUserProfile);
  router.delete("/auth/profile", protect, autoGenerateToken, deleteUserProfile);

  // Profile photo upload route - USE the uploadPhoto passed as an argument
  router.put(
    "/auth/profile/photo",
    protect,
    autoGenerateToken,
    // Use the uploadPhoto instance received by this function
    uploadPhoto.single("profilePhoto"),
    uploadProfilePhotoController
  );

  // Address routes
  router.get("/user/addresses/:userId", protect, autoGenerateToken, getUserAddress);
  router.put("/user/addresses/:userId", protect, autoGenerateToken, updateUserAddress);
  router.delete("/user/addresses/:userId", protect, autoGenerateToken, deleteUserAddress);

  // Cards route
  router.put("/profile/cards", protect, autoGenerateToken, updateUserCards);

  // *** New route for fetching all users (Admin-only) ***
  router.get("/users", protect, adminOnly, getAllUsers);

  return router; // Export the configured router
};

// Remove the old CommonJS export:
// module.exports = router;
  deleteUserAddress,
  updateUserCards,
  getAllUsers,
  deleteAllUsers,
  uploadProfilePhotoController,
} = require("../controllers/profileController");
const { protect, autoGenerateToken, adminOnly } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/profileMulter");

// Authentication routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh-token", refreshToken);

// User profile routes
router.get("/auth/profile", protect, autoGenerateToken, getUserProfile);
router.put("/auth/profile", protect, autoGenerateToken, updateUserProfile);
router.delete("/auth/profile", protect, autoGenerateToken, deleteUserProfile);

// Profile photo upload route
router.put(
  "/auth/profile/photo",
  protect,
  autoGenerateToken,
  uploadPhoto.single("profilePhoto"),
  uploadProfilePhotoController
);

// Address routes
router.get("/user/addresses/:userId", protect, autoGenerateToken, getUserAddress);
router.put("/user/addresses/:userId", protect, autoGenerateToken, updateUserAddress);
router.delete("/user/addresses/:userId", protect, autoGenerateToken, deleteUserAddress);

// Cards route
router.put("/profile/cards", protect, autoGenerateToken, updateUserCards);

// *** New route for fetching all users (Admin-only) ***
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
